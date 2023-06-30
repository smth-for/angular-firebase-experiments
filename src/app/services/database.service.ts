import { ExtendedUser } from "../models/user.model";
import { Injectable } from "@angular/core";
import { User } from "firebase/auth";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { Observable } from "rxjs";


@Injectable()
export class DatabaseService {

  //* @param userDb -> a reference to the collection
  private readonly userDb;

  public municipality$: Observable<string[]>;

  constructor(private db: AngularFireDatabase) {
    this.userDb = this.db.database.ref('users/');
    this.municipality$ = new Observable<string[]>((subscriber) => {
      this.db.database.ref('support').child('municipality').on('value', (res: any) => {
        const municipalityArray = res.val()
        subscriber.next(municipalityArray);
        subscriber.complete();
      })
    })
  }
  
  //* Getting user from the database
  public getUserByAuthIdQuery(authId: string) {
    return this.userDb.child(authId)
  }

  public updateUserData(user: ExtendedUser | null) {
    console.debug('Updating User...');
    const object = {
      [user?.uid!]: user?.getUserData()
    }
    this.userDb.update(object).then((v) => {
      console.log('Updated User Data!')
    }, (error) => {
      throw new Error('Error updating user data', error);
    })
  }

  public deleteUserData(user: User) {

    this.getUserByAuthIdQuery(user.uid).get().then(snapshot => {
      snapshot.ref.remove();
      const val = snapshot.val();
      if (!!val) {
        const key = Object.keys(val)[0];
        snapshot.child(key).ref.remove((error) => {
          if (!error) {
            console.log('user-data-deleted')
          } else {
            console.error(error)
          }
        });
      }
    })
  }


}