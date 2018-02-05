import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { HttpModule } from '@angular/http';

import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  domain = 'http://localhost:3000/';

  constructor(
  private http: Http
  ) { }

  registerUser(user) {
    return this.http.post(this.domain + 'users/signup', user)
      .map(res => res.json());
  }
}
