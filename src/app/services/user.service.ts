import { Observable, distinctUntilChanged, filter, first, interval, map, of, share, shareReplay, switchMap, tap } from "rxjs";
import { ExtendedUser } from "../models/user.model";
import { Injectable } from "@angular/core";
import { User } from "firebase/auth";
import { DatabaseService } from "./database.service";
import { AuthService } from "./auth.service";
import { AngularFireAnalytics } from "@angular/fire/compat/analytics";

@Injectable()
export class UserService {

  //* @param dbUser$ -> database user
  //@ts-ignore
  dbUser$: Observable<ExtendedUser | null>;

  //* @param authUser$ -> authentication user
  authUser$: Observable<User | null>;

  //* @param isLoggeIn$ -> track is there is a logged user
  isLoggedIn$: Observable<boolean> =
    this.authService.authState$.pipe(
      map(user => !!user),
    )

  private userDataReference: any;

  constructor(
    private authService: AuthService, 
    private dbService: DatabaseService, 
    private analytics: AngularFireAnalytics
  ) {

    this.authUser$ = this.authService.authState$.pipe(
      first(),
      tap((user: any) => this.analytics.setUserId(user.uid)),
      //@ts-ignore
      map(user => user?.multiFactor.user)
    )

    this.dbUser$ = this.authService.authState$.pipe(
      switchMap((firebaseUser) => {

        if (!!firebaseUser) {
          const user = new ExtendedUser(firebaseUser as any as User);

          return new Observable<ExtendedUser>((subscriber) => {
            this.userDataReference = dbService.getUserByAuthIdQuery(firebaseUser.uid);
            this.userDataReference.on('value', (userData: any) => {
              const data: User = userData.val();
              user.setUserData(data)
              if (!data) {
                this.dbService.updateUserData(user)
              }
              subscriber.next(user);
            })
          })
        }
        this.userDataReference.off();
        this.userDataReference = null;
        return of(null);
      })
    )
  }

  public getTown(): Observable<string | undefined> {
    return this.dbUser$.pipe(
      map(user => user?.town),
      distinctUntilChanged()
    )
  }

  public delete(): any {
    this.dbUser$.pipe(
      first(),
      filter(u => !!u)
    ).subscribe(
      () => console.debug('user-deleted-from-db'))
  }

  public addMunicipality(mun: string) {
    this.dbUser$.pipe(
      first(),
      filter(user => !!user)
    ).subscribe(user => {
      user?.setTown(mun);
      this.dbService.updateUserData(user);
    })
  }

}
