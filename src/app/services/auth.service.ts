import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { 
  getAuth, 
  sendEmailVerification, 
  sendPasswordResetEmail, 
  updatePassword, 
  GithubAuthProvider, 
  GoogleAuthProvider, 
  signInWithPopup, 
  linkWithCredential, 
  OAuthProvider, 
  Auth, 
  AuthProvider, 
  AuthCredential, 
  User, 
  deleteUser 
} from 'firebase/auth'
import { 
  BehaviorSubject, 
  Subject, 
  distinctUntilChanged, 
  filter, 
  first, 
  from, 
  shareReplay, 
  switchMap, 
  tap 
} from 'rxjs';
import { DatabaseService } from './database.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ExtendedUser } from '../models/user.model';


@Injectable()
export class AuthService {

  //* @param url -> contains the url for actionCodeSettings
  public url: string = 'http://localhost:4200';

  public hasError$ = new BehaviorSubject<boolean>(false);

  //* @param authSubject$ -> a Subject to track the authenticated user (by AngularFireAuth module)
  public authSubject$ = new Subject<User | null>();

  //* @param authState$ -> track if the user is authenticated or not
  public authState$ = this.authSubject$.pipe(
    tap(u => console.log('Authstate', u)),
    distinctUntilChanged(),

    tap(user => {
      if (user)
        this.router.navigateByUrl('/home')
      else
        this.router.navigateByUrl('/login')
    }
    ),
    shareReplay(1),
  );

  constructor(
    public firebaseAuth: AngularFireAuth, 
    private router: Router, 
    private db: DatabaseService, 
    public analytics: AngularFireAnalytics
  ) {
    this.firebaseAuth.onAuthStateChanged(user => this.authSubject$.next(user as User));
  }

  // * signIn method with username and password
  public signIn(email: string, password: string) {
    this.firebaseAuth.signInWithEmailAndPassword(email, password).catch(err => console.debug(err));
  }

  // * signUp method with username and password
  public signUp(email: string, password: string ) {
    from(this.firebaseAuth.createUserWithEmailAndPassword(email, password)).subscribe(
      ( res ) => {
        //@ts-ignore
        let accessUser = res.user?.multiFactor.user 
        let newUser: ExtendedUser =  new ExtendedUser(res.user as User)
        newUser.setName(accessUser.email)
        this.db.updateUserData(newUser)
        sendEmailVerification(res.user as User);
      }
    );
  }

  // * send email verification if not already verified (auth().currentUser.isVerified: boolean)
  public sendEmailVerificationFunction() {
    const actionCodeSettings = {
      url: `${this.url}`,
      handleCodeInApp: true
    };
    sendEmailVerification( getAuth().currentUser as User , actionCodeSettings)
  }

  // * change authenticated user's password
  public changePass(newPassword: string) {
    const auth = getAuth();
    const user: any = auth.currentUser;

    this.authState$.pipe(
      first(),
      filter(user => !!user)
    ).subscribe(() => {
      console.log("changing password");
      from(updatePassword(user, newPassword)).subscribe(() => {
        this.logout()
      })
    })
  }

  // * handle forget password 
  public forgetPassword(email: string) {
    this.router.navigateByUrl('/f-pass')
    const actionCodeSettings = {
      url: `${this.url}`,
      handleCodeInApp: true
    };
    console.log('fpass');

    from(sendPasswordResetEmail(getAuth(), email, actionCodeSettings)).subscribe(() => {
      this.router.navigateByUrl('/home')
    })
  }

  // * Login method via GitHub Provider
  public gitHubLogin() {
    console.debug("gitHub-provider-login");

    const auth = getAuth();
    const provider = new GithubAuthProvider()

    this.signInWithPopupProvider(auth, provider);
  }

  // * Login method via Google Auth Provider
  public googleLogin() {
    console.debug("google-provider-login");

    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    this.signInWithPopupProvider(auth, provider);
  }

  // * called from other auth providers -> handle the sign-in process
  private signInWithPopupProvider(auth: Auth, provider: AuthProvider){
    from(signInWithPopup(auth, provider)).subscribe(
      (res) => {
        const user = res.user
        console.debug('provider-sign-in-successful');
        this.analytics.setUserId(user.uid)
        this.analytics.setUserProperties({
          email: user.email,
          name: user.displayName,
        })
        this.analytics.logEvent('login')
      },
      (error) => {
        console.log(error);
        this.handleLoginSinginErrors(error)
      }
    );
  }

  public handleLoginSinginErrors(error: FirebaseError) {
    let user: any = error.customData;
    var credential: any = OAuthProvider.credentialFromError(error)
    const auth = getAuth();
    var googleProvider = new GoogleAuthProvider()
    var githubProvider = new GithubAuthProvider()


    if (error.code === 'auth/cancelled-popup-closed')
      console.log('reload');
    if (error.code === 'auth/account-exists-with-different-credential')
      console.log('Handle multi account')
    from(this.firebaseAuth.fetchSignInMethodsForEmail(user.email)).subscribe(
      (signinMethods) => {

        switch (signinMethods[0]) {

          case 'google.com':
            console.log('google.com');
            this.singInWithDifferentProvider(auth, googleProvider, credential)
            break;

          case 'github.com':
            console.log('github.com');
            this.singInWithDifferentProvider(auth, githubProvider, credential)
            break;

          case 'password':
            console.log('password');
            this.hasError$.next(true)
            break;
        }
      }
    )
  }

  // * Link account with other providers
  private singInWithDifferentProvider(auth: Auth, provider: AuthProvider, credential: AuthCredential) {
    from(signInWithPopup(auth, provider)).subscribe((res) => {
      if (res.user) {
        console.debug('signed-in', auth.currentUser);
        //link accounts
        linkWithCredential(res.user, credential);
      }
      return;
    })
  }

  public logout() {
    from(this.firebaseAuth.signOut()).subscribe(() => {
      console.debug("logout");
      this.router.navigateByUrl('/login')
    })
  }

  public deleteAccount() {
    this.authState$.pipe(
      first(),
      filter(user => !!user),
      tap(user => {
        this.authSubject$.next(null);
        this.db.deleteUserData(user!);
      }),
      switchMap(user => from(deleteUser(user as any as User)))
    ).subscribe(()=>{
       console.log('user-auth-deleted'); 
    })
  }
}



