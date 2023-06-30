import { NgModule, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
import { UserService } from "./services/user.service";
import { DatabaseService } from "./services/database.service";
import { CookieService } from "ngx-cookie-service";

@NgModule()
export class MokGuard implements OnInit {
  constructor(
    public auth: AuthService,
    public router: Router,
    public userService: UserService,
    public databaseService: DatabaseService,
    public cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.userService.isLoggedIn$.subscribe(
      (res) => {
        if (!res) {
          this.router.navigateByUrl('/login')
        }
      }
    );
  }
}