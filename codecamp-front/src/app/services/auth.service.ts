import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { HttpModule } from '@angular/http';

import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class AuthService {
  public authToken: any;
  public user: any;
<<<<<<< HEAD
  //public domain = 'http://localhost:3000/';
=======
  public domain = 'http://localhost:80/';
>>>>>>> e7e94b10d07609752ce6af9b761eca210a8fedd0
  public options;

  constructor(
  private http: Http
  ) { }
  public name: Subject<String> = new Subject<String>();
  public createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }

  public loadToken() {
    this.authToken = localStorage.getItem('token'); // Get tokens and asssign to variable to be used elsewhere
  }
  public registerUser(user) {
    return this.http.post('users/signup', user)
      .map(res => res.json());
  }

  public loginUser(user) {
    return this.http.post('users/signin', user)
    .map(res => res.json());
  }

  public storeUserData(token, user) {

    localStorage.setItem('token', token); // Set token in local storage
    localStorage.setItem('user', JSON.stringify(user));
   // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
    // this.user.isAdmin = user.isAdmin;
  }

  public checkisAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user === undefined || user === null) {
      return false;
    } else if (user.isAdmin === true) {
      return true;
    }
  }

  public getUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  public loggedIn() {
    return tokenNotExpired();
  }

  public logout() {
    this.authToken = null; // Set token to null
    this.user = '';
    localStorage.clear(); // Clear local storage
  }
  getProfile() {
    this.createAuthenticationHeaders();
    return this.http.get('users/profile', this.options).map(res => res.json());
  }
}
