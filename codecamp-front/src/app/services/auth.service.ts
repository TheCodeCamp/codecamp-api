import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  public authToken: any;
  public user: any;
  public name: Subject<String> = new Subject<String>();

  constructor(private http: HttpClient) { }

  // Build a full API URL. When apiBase is empty the path stays relative so the
  // SPA talks to whatever origin served it.
  private api(path: string): string {
    const base = environment.apiBase;
    const clean = path.replace(/^\//, '');
    return base ? base.replace(/\/$/, '') + '/' + clean : clean;
  }

  private authHeaders(): HttpHeaders {
    this.loadToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.authToken || ''
    });
  }

  public loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  public registerUser(user): Observable<any> {
    return this.http.post(this.api('users/signup'), user);
  }

  public loginUser(user): Observable<any> {
    return this.http.post(this.api('users/signin'), user);
  }

  public storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
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
    return JSON.parse(localStorage.getItem('user'));
  }

  public loggedIn() {
    return tokenNotExpired();
  }

  public logout() {
    this.authToken = null;
    this.user = '';
    localStorage.clear();
  }

  public getProfile(): Observable<any> {
    return this.http.get(this.api('users/profile'), { headers: this.authHeaders() });
  }
}
