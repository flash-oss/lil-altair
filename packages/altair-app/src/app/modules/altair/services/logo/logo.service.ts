import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { RootState } from 'altair-graphql-core/build/types/state/state.interfaces';

@Injectable()
export class LogoService {
  private store = inject<Store<RootState>>(Store);
  private environment$ = this.store.pipe(
    select('settings'),
    map(settings => (settings && settings.environment) || 'production')
  );

  private readonly logoPathMap: Record<string, string> = {
    'uat': 'assets/img/Logo Payment_uat.svg',
    'dark': 'assets/img/Logo Payment dark.svg',
    'light': 'assets/img/Logo Payments light.svg',
    'default': 'assets/img/Logo Payments light.svg'
  };

  getLogoPath(): Observable<string | undefined> {
    return combineLatest([
      this.store.pipe(
        select('settings'),
        map(settings => settings || {})
      ),
      this.environment$
    ]).pipe(
      map(([settings, environment]) => {
        const theme = settings.theme || 'light';
        const isDarkTheme = theme === 'dark' ||
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);


        switch (true) {
          case environment === 'uat':
            return this.logoPathMap['uat'];
          case isDarkTheme:
            return this.logoPathMap['dark'];
          case !isDarkTheme:
            return this.logoPathMap['light'];
          default:
            return this.logoPathMap['default'];
        }
      })
    );
  }
}
