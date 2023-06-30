import { 
  Component, 
  OnInit 
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css'],
})
export class CookieConsentComponent implements OnInit{

  constructor(
    public cookieService: CookieService, 
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  acceptCookies(): void {
    this.cookieService.set('cookieConsent', 'true', 365);
    this.auth.analytics.setAnalyticsCollectionEnabled(true)
  }

  rejectCookies(): void {
    this.cookieService.set('cookieConsent', 'false', 365);
  }
}
