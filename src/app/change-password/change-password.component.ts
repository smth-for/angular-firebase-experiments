import { Component } from '@angular/core';
import { MokGuard } from '../mok-guard';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent extends MokGuard {

  public changePassword(newPassword: string, newPasswordAgain: string){
    if(newPassword === newPasswordAgain)
      this.auth.changePass(newPassword)
    else
      console.log("Passwords doesn't match");
  }
}
