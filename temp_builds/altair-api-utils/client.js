import { ALTAIR_API_USER_TOKEN_STORAGE_KEY, OAUTH_POPUP_CALLBACK_MESSAGE_TYPE, } from './constants';
import ky from 'ky';
import { IdentityProvider, } from '@altairgraphql/db';
import { getAltairConfig } from 'altair-graphql-core/build/config';
import { firstValueFrom, from, Observable, Subject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
const SignInTimeout = 15 * 60 * 1000; // 15m
const timeout = (prom, time, exception = new Error('timeout exceeded!')) => {
    let timer;
    return Promise.race([
        prom,
        new Promise((_r, rej) => (timer = setTimeout(rej, time, exception))),
    ]).finally(() => clearTimeout(timer));
};
export class APIClient {
    get user() {
        return this._user;
    }
    set user(val) {
        this._user = val;
        this.user$.next(val);
    }
    constructor(urlConfig) {
        this.urlConfig = urlConfig;
        this.user$ = new Subject();
        this.ky = ky.extend({
            prefixUrl: urlConfig.api,
            hooks: {
                beforeRequest: [(req) => this.setAuthHeaderBeforeRequest(req)],
            },
            timeout: false,
        });
        this.checkCachedUser();
    }
    async checkCachedUser() {
        if (this.user) {
            // No need to do anything if the user is already set
            return;
        }
        // Check for user access token in local storage
        const cachedToken = this.getCachedToken();
        if (cachedToken) {
            return this.signInWithCustomToken(cachedToken).catch(() => {
                this.signOut();
            });
        }
        this.user = undefined;
    }
    setCachedToken(token) {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(ALTAIR_API_USER_TOKEN_STORAGE_KEY, token);
        }
    }
    getCachedToken() {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem(ALTAIR_API_USER_TOKEN_STORAGE_KEY);
        }
    }
    clearCachedToken() {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(ALTAIR_API_USER_TOKEN_STORAGE_KEY);
        }
    }
    setAuthHeaderBeforeRequest(req) {
        if (this.authToken) {
            req.headers.set('Authorization', `Bearer ${this.authToken}`);
        }
    }
    nonce() {
        const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let array = new Uint8Array(40);
        crypto.getRandomValues(array);
        array = array.map((x) => validChars.charCodeAt(x % validChars.length));
        return String.fromCharCode(...array);
    }
    getPopupUrl(nonce, provider = IdentityProvider.GOOGLE) {
        const url = new URL(this.urlConfig.loginClient);
        url.searchParams.append('nonce', nonce);
        url.searchParams.append('sc', location.origin);
        url.searchParams.append('provider', provider);
        return url.href;
    }
    observeUser() {
        // check user and force the value to be emitted
        // Forcing the value to be emitted triggers the observable at least once
        this.checkCachedUser().then(() => this.user$.next(this.user));
        return this.user$.asObservable();
    }
    async getUser() {
        return firstValueFrom(this.observeUser().pipe(take(1)));
    }
    async signInWithCustomToken(token) {
        this.authToken = token;
        this.setCachedToken(token);
        const user = await this.ky.get('auth/me').json();
        this.user = user;
        return user;
    }
    async signinWithPopup(provider = IdentityProvider.GOOGLE) {
        const token = await timeout(this.signinWithPopupGetToken(provider), SignInTimeout);
        return this.signInWithCustomToken(token);
    }
    async signinWithPopupGetToken(provider = IdentityProvider.GOOGLE) {
        const nonce = this.nonce();
        const popup = window.open(this.getPopupUrl(nonce, provider), '_blank');
        if (!popup) {
            throw new Error('Could not create signin popup!');
        }
        return new Promise((resolve, reject) => {
            const listener = (message) => {
                try {
                    const type = message?.data?.type;
                    if (type === OAUTH_POPUP_CALLBACK_MESSAGE_TYPE) {
                        if (new URL(message.origin).href !==
                            new URL(this.urlConfig.loginClient).href) {
                            return reject(new Error('origin does not match!'));
                        }
                        // Verify returned nonce
                        if (nonce !== message?.data?.payload?.nonce) {
                            window.removeEventListener('message', listener);
                            return reject(new Error('nonce does not match!'));
                        }
                        const token = message?.data?.payload?.token;
                        window.removeEventListener('message', listener);
                        return resolve(token);
                    }
                }
                catch (err) {
                    reject(err);
                }
            };
            window.addEventListener('message', listener);
        });
    }
    signOut() {
        this.authToken = undefined;
        this.user = undefined;
        this.clearCachedToken();
    }
    createQuery(queryInput) {
        return this.ky.post('queries', { json: queryInput }).json();
    }
    updateQuery(id, queryInput) {
        return this.ky.patch(`queries/${id}`, { json: queryInput }).json();
    }
    deleteQuery(id) {
        return this.ky.delete(`queries/${id}`).json();
    }
    getQuery(id) {
        return this.ky.get(`queries/${id}`).json();
    }
    getQueryRevisions(id) {
        return this.ky
            .get(`queries/${id}/revisions`)
            .json();
    }
    restoreQueryRevision(id, revisionId) {
        return this.ky
            .post(`queries/${id}/revisions/${revisionId}/restore`)
            .json();
    }
    createQueryCollection(collectionInput) {
        return this.ky
            .post('query-collections', { json: collectionInput })
            .json();
    }
    updateCollection(id, collectionInput) {
        return this.ky
            .patch(`query-collections/${id}`, { json: collectionInput })
            .json();
    }
    deleteCollection(id) {
        return this.ky.delete(`query-collections/${id}`).json();
    }
    getCollection(id) {
        return this.ky
            .get(`query-collections/${id}`)
            .json();
    }
    getCollections() {
        return this.ky.get(`query-collections`).json();
    }
    createTeam(teamInput) {
        return this.ky.post('teams', { json: teamInput }).json();
    }
    updateTeam(id, teamInput) {
        return this.ky.patch(`teams/${id}`, { json: teamInput }).json();
    }
    deleteTeam(id) {
        return this.ky.delete(`teams/${id}`).json();
    }
    getTeam(id) {
        return this.ky.get(`teams/${id}`).json();
    }
    getTeams() {
        return this.ky.get(`teams`).json();
    }
    addTeamMember(input) {
        return this.ky.post('team-memberships', { json: input }).json();
    }
    getTeamMembers(teamId) {
        return this.ky
            .get(`team-memberships/team/${teamId}`)
            .json();
    }
    getWorkspaces() {
        return this.ky.get(`workspaces`).json();
    }
    getBillingUrl() {
        return this.ky.get('user/billing').json();
    }
    getUpgradeProUrl() {
        return this.ky.get('user/upgrade-pro').json();
    }
    async openBillingPage() {
        const res = await this.getBillingUrl();
        window.open(res.url, '_blank');
    }
    getUserStats() {
        return this.ky.get('user/stats').json();
    }
    getUserPlan() {
        return this.ky.get('user/plan').json();
    }
    getPlanInfos() {
        return this.ky.get('plans').json();
    }
    getAvailableCredits() {
        return this.ky.get('credits').json();
    }
    buyCredits() {
        return this.ky.post('credits/buy').json();
    }
    getActiveAiSession() {
        return this.ky.get('ai/sessions/active').json();
    }
    createAiSession() {
        return this.ky.post('ai/sessions').json();
    }
    getAiSessionMessages(sessionId) {
        return this.ky.get(`ai/sessions/${sessionId}/messages`).json();
    }
    sendMessageToAiSession(sessionId, input) {
        return this.ky
            .post(`ai/sessions/${sessionId}/messages`, { json: input })
            .json();
    }
    rateAiMessage(sessionId, messageId, input) {
        return this.ky
            .post(`ai/sessions/${sessionId}/messages/${messageId}/rate`, {
            json: input,
        })
            .json();
    }
    getQueryShareUrl(queryId) {
        const url = new URL(this.urlConfig.loginClient);
        url.searchParams.set('action', 'share');
        url.searchParams.set('q', queryId);
        return url.toString();
    }
    // short-lived-token for events
    getSLT() {
        return this.ky.get(`auth/slt`).json();
    }
    fromEventSource(url) {
        return new Observable((subscriber) => {
            const eventSource = new EventSource(url);
            eventSource.onmessage = (x) => subscriber.next(x.data);
            eventSource.onerror = (x) => subscriber.error(x);
            return () => {
                eventSource?.close();
            };
        });
    }
    listenForEvents() {
        return from(this.getSLT()).pipe(take(1), map((res) => {
            const url = new URL('/events', this.urlConfig.api);
            url.searchParams.append('slt', res.slt);
            return url.href;
        }), switchMap((url) => this.fromEventSource(url)));
    }
}
export const initializeClient = (env = 'development') => {
    const apiClient = new APIClient(getAltairConfig().getUrlConfig(env));
    return apiClient;
};
//# sourceMappingURL=client.js.map