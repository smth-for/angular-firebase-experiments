import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat'
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environment/environment.prod';
import { HomeComponent } from './home/home.component';
import { AuthService } from './services/auth.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { PromptUserPasswordComponent } from './prompt-user-password/prompt-user-password.component';
import { LoginComponent } from './login/login.component';
import { PopupComponent } from './popup/popup.component';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { DatabaseService } from './services/database.service';
import { UserService } from './services/user.service';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChangePasswordComponent,
    ForgetPasswordComponent,
    PromptUserPasswordComponent,
    LoginComponent,
    PopupComponent,
    CookieConsentComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule,
    AngularFireAuthModule,
  ],
  providers: [
    AuthService,
    DatabaseService, 
    UserService,
    CookieService,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
