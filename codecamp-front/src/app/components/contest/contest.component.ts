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
  constructor(
    public authService: AuthService,
    private router: Router,
    public contestService: ContestService
  ) { }

  ngOnInit() {
    this.contestService.getContest().subscribe(contest => {
      this.contest = contest.contests;
    });
  }

  onSelectContest(i) {
    this.router.navigate(['/contest', i]);
  }

  onAddContest() {
    this.router.navigate(['/contest/add-contest']);
  }
  onEditContest() {
    this.router.navigate(['/contest/edit-contest']);
  }
}
