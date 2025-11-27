
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d82f737d-55ef-5fbb-8dff-1480469ab2b6")}catch(e){}}();
import{a as r}from"./chunk-2K4F66BQ.js";import{j as e}from"./chunk-B7YGBANW.js";var t=class extends r{execute(a){return e(this,null,function*(){return!a.data?.username||!a.data?.password?{headers:{}}:{headers:{Authorization:`Basic ${btoa(`${this.hydrate(a.data.username)}:${this.hydrate(a.data.password)}`)}`}}})}};export{t as default};
//# sourceMappingURL=chunk-QQFA4BQW.js.map

//# debugId=d82f737d-55ef-5fbb-8dff-1480469ab2b6
