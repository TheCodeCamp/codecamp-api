import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import { HttpModule } from '@angular/http';

import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  domain = 'http://localhost:3000';
  options;
  isAdmin;

  constructor(
  private http: Http
  ) { }

  createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
    console.log(this.authToken); // Get token and asssign to variable to be used elsewhere
  }
  registerUser(user) {
    return this.http.post(this.domain + '/users/signup', user)
      .map(res => res.json());
  }

  loginUser(user) {
    return this.http.post(this.domain + '/users/signin', user)
    .map(res => res.json());
  }

  storeUserData(token, user, isAdmin) {

    localStorage.setItem('token', token); // Set token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
    this.isAdmin = isAdmin;
  }

  checkisAdmin() {
    if (this.isAdmin) {
      return true;
    } else {
      return false;
    }
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logout() {
    this.authToken = null; // Set token to null
    this.user = null; // Set user to null
    localStorage.clear(); // Clear local storage
  }
  getprofile() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/users/profile', this.options).map(res => res.json());
  }
}
