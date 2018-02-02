import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { HttpModule } from '@angular/http';

import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  constructor(
  private http: Http
  ) { }

  registerUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/signup', user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/login', user, {headers: headers})
      .map(res => res.json());
  }

  getProfile(){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorizaton', this.authToken );
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users/profile', { headers: headers })
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem(' id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();

  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

}
