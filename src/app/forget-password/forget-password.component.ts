import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {

  alertFlag: boolean = false;
  email: string = "";

  constructor(public authService: AuthService){}

  public forgetPassword( email: string ){
    console.log('f-pass-click');
    this.email = email
    this.authService.forgetPassword(email);
    this.alertFlag = !this.alertFlag
  }
}
