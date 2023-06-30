import { 
  Component, 
  EventEmitter, 
  OnInit, 
  Output 
} from '@angular/core';
import { MokGuard } from '../mok-guard';
import { 
  filter, 
  map 
} from 'rxjs';
import { environment } from 'src/environment/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent extends MokGuard implements OnInit {
  @Output() isLogout = new EventEmitter <void>();

  override ngOnInit(): void {
    this.auth.analytics.logEvent('reaload')
  }

  public town$ = this.userService.dbUser$.pipe(
    filter(user => !!user),
    map(user => user?.town || '')
  );

  public logout(){
    this.auth.logout();
    this.isLogout.emit();
  }

  public changePassword(){
    this.router.navigateByUrl('/c-pass');
  }

  public deleteAccount(){
    this.auth.deleteAccount();
  }

  public insertTown(municipality: string){
    this.userService.addMunicipality(municipality)
  }

  public verifyEmail(){
    this.auth.sendEmailVerificationFunction();
  }

  //* @param value: boolean -> if false, the user has clicked the Opt-out button, if true, the user has clicked the Opt-in button
  public optOut(){
      console.debug('opt-out');    
      this.auth.analytics.setAnalyticsCollectionEnabled(false);
      //@ts-ignore
      window[`ga-disable-${environment.ga.measurementId}`] = true;
      this.cookieService.delete('cookieConsent');
      this.cookieService.delete('_ga');
      this.cookieService.delete('_ga_30EFP1TEML')
  }
  public count() {
    this.auth.analytics.logEvent('count');
  }
}
