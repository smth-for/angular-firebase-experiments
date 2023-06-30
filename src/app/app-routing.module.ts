import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { PromptUserPasswordComponent } from './prompt-user-password/prompt-user-password.component';
import { LoginComponent } from './login/login.component';
import { PopupComponent } from './popup/popup.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'f-pass',
    component: ForgetPasswordComponent
  },
  {
    path: 'c-pass',
    component: ChangePasswordComponent
  },
  {
    path: 'p-pass',
    component: PromptUserPasswordComponent
  },
  {
    path: 'popup',
    component: PopupComponent
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule { }