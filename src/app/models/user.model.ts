import { User } from "firebase/auth";

//@ts-ignore
export class ExtendedUser {

  public readonly firebaseUser: User;

  public displayName = '';
  public photoURL = '';

  town = '';

  constructor(firebaseUser: User) {
    this.firebaseUser = firebaseUser;
    this.displayName = firebaseUser.displayName || '';
    this.photoURL = firebaseUser.photoURL || '';
  }

  setName (name: string) {
    this.displayName = name;
  }

  setUserData(userData: any | null) {
    this.town = userData?.town || '';
  }

  setTown(town: string) {
    this.town = town;
  }

  getTown(): string {
    return this.town
  }

  get uid() {
    return this.firebaseUser.uid;
  }

  get email() {
    return this.firebaseUser.email;
  }

  getUserData() {
    return {
      displayName: this.displayName,
      photoURL: this.photoURL,
      town: this.town,
    }
  }

  changeUsername(newUsername: string){
    this.displayName = newUsername;
  }
}