import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpModule } from '@angular/http';

import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ContestService {

  public authToken: any;
  public user: any;
  public contest: any;
  public domain = 'http://localhost:3000';
  public options;


  public activeContest = new Subject();
  constructor(
    private http: Http
  ) { }

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
    this.authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
  }

  public addContest(contest) {
    return this.http
      .post(this.domain + '/contest', contest)
        .map(res => res.json());
  }

  public getContest() {
    return this.http.get(this.domain + '/contest')
        .map(res => res.json());
  }

  public addProblem(problem, contest) {
    return this.http.post(this.domain + '/contest/' + contest, problem)
      .map(res => res.json());
  }

  public getProblems(contest) {
    return this.http.get(this.domain + '/contest/' + contest)
        .map(res => res.json());
  }

  public getProblem(code, contest) {
    return this.http.get(this.domain + '/contest/' + contest + '/problems/' + code)
      .map((res) =>{
         return res.json();
      });
  }

  public addSolution(solution) {
    console.log(solution.description);
    return this.http.post(this.domain + '/solution', solution)
      .map(res => res.json());
  }
}
