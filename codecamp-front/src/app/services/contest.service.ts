import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class ContestService {

  public authToken: any;
  public user: any;
  public contest: any;
  public sol;
  public toggler: boolean;

  private contestSource = new BehaviorSubject<string>('default contest');
  currentContest = this.contestSource.asObservable();

  private Toggler = new BehaviorSubject<boolean>(true);
  toggle = this.Toggler.asObservable();

  public activeContest = new Subject();
  public time: Subject<String> = new Subject<String>();

  constructor(private http: HttpClient) { }

  private api(path: string): string {
    const base = environment.apiBase;
    const clean = path.replace(/^\//, '');
    return base ? base.replace(/\/$/, '') + '/' + clean : clean;
  }

  public loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  public addContest(contest): Observable<any> {
    return this.http.post(this.api('contest'), contest);
  }

  public getContest(): Observable<any> {
    return this.http.get(this.api('contest'));
  }

  public addProblem(problem, contest): Observable<any> {
    return this.http.post(this.api('contest/' + contest), problem);
  }

  public getProblems(contest): Observable<any> {
    return this.http.get(this.api('contest/' + contest));
  }

  public getProblem(code, contest): Observable<any> {
    return this.http.get(this.api('contest/' + contest + '/problems/' + code));
  }

  public addSolution(solution): Observable<any> {
    return this.http.post(this.api('solution'), solution);
  }

  public deleteContest(contest): Observable<any> {
    return this.http.delete(this.api('contest/' + contest));
  }

  public getRankings(contest): Observable<any> {
    return this.http.get(this.api('rankings/' + contest));
  }

  public getSubmissionHistory(username, page = 1, limit = 20): Observable<any> {
    return this.http.get(this.api('solution/history/' + username + '?page=' + page + '&limit=' + limit));
  }

  public setSolution(sol) {
    this.sol = sol;
  }

  public getSolution() {
    return this.sol;
  }

  changeContest(contest: string) {
    this.contestSource.next(contest);
  }

  ontoggle(value: boolean) {
    this.Toggler.next(value);
  }
}
