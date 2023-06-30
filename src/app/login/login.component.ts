import { 
  Component, 
  OnInit 
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { first, filter } from 'rxjs';
import { UserService } from '../services/user.service';
import { DatabaseService } from '../services/database.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  public title = 'first-angular-app';
  public fPass = false;
  public popupFlag = false;
  public signInSignUpFlag = false;

  constructor(
    public auth: AuthService, 
    private router: Router, 
    public userService: UserService, 
    public databaseService: DatabaseService,
    public cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.userService.isLoggedIn$.pipe(
      first(),
      filter(isLoggedIn => isLoggedIn)
    ).subscribe(() => {
      this.router.navigateByUrl('/home');
    })
  }

  public onSignUp(email: string, password: string, confirmPass: string) {
    
      if (password === confirmPass) {
        this.auth.signUp(email, password);
        if (!this.userService.isLoggedIn$)
          this.logout();
      } else {
        alert("Passwords doesn't match")
      }

  }

  public onSignIn(email: string, password: string) {
    this.auth.signIn(email, password)
  }

  public logout() {
    this.auth.logout();
  }

  public forgetPassword() {
    this.router.navigateByUrl('/f-pass')
  }

  public loginViaGitHub() {
    this.auth.gitHubLogin();
  }

  public loginViaGoogleAuth() {
    this.auth.googleLogin();
  }

  public changeFlag() {
    this.signInSignUpFlag = !this.signInSignUpFlag;
  }
}
