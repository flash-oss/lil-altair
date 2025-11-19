import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { RootState } from 'altair-graphql-core/build/types/state/state.interfaces';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private store = inject<Store<RootState>>(Store);
  private environment$ = this.store.pipe(
    select('settings'),
    map(settings => (settings && settings.environment) || 'production')
  );

  private readonly paymentIconPathMap: Record<string, string> = {
    'uat': 'assets/img/payments_uat.png',
    'default': 'assets/img/payments_main.png'
  };

  getPaymentIconPath(): Observable<string | undefined> {
    return this.environment$.pipe(
      map(environment => {
        return environment === 'uat'
          ? this.paymentIconPathMap['uat']
          : this.paymentIconPathMap['default'];
      })
    );
  }

  getLogoPath(): Observable<string | undefined> {
    return this.environment$.pipe(
      map(environment => {
        return environment === 'uat'
          ? this.paymentIconPathMap['uat']
          : this.paymentIconPathMap['default'];
      })
    );
  }
}
