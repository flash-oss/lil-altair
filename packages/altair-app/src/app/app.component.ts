import { Component, OnInit } from '@angular/core';
import { IconService } from './modules/altair/services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private iconService: IconService) {}

  ngOnInit() {
    this.iconService.getPaymentIconPath()
      .pipe(take(1))
      .subscribe(iconPath => {
        const loadingScreenLogo = document.querySelector('.loading-screen-logo-container img');
        if (loadingScreenLogo) {
          (loadingScreenLogo as HTMLImageElement).src = iconPath || '';
        }
      });
  }
}
