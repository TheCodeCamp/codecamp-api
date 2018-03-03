import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ContestService } from '../../services/contest.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {
  contest;
  contestname;
  
  constructor(
    public authService: AuthService,
    private router: Router,
    public contestService: ContestService
  ) { }

  ngOnInit() {
    this.contestService.getContest().subscribe(
      contest => {
      this.contest = contest.contests; 
    });
    this.contestService.currentContest.subscribe(contest => this.contestname=contest);
  }

  replaceTZ(time) {
    return time && time.replace(/[TZ]|.000/g,'<br>');
  }
  onSelectContest(i) {
    this.contestname = i.name;
    this.contestService.changeContest(this.contestname);
    this.router.navigate(['/contest', i.id]);
  }

  onAddContest() {
    this.router.navigate(['/contest/add-contest']);
  }
  onEditContest() {
    this.router.navigate(['/contest/edit-contest']);
  }
}
