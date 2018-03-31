import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
  selector: 'app-ranklist',
  templateUrl: './ranklist.component.html',
  styleUrls: ['./ranklist.component.css']
})
export class RanklistComponent implements OnInit, OnDestroy {

  contest;
  ranks;
  problems;
  rank = [];
  private alive: boolean;
  constructor(
    private contestService: ContestService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
   ) {
     this.alive = true;
   }

  ngOnInit() {
    this.contest = this.route.snapshot.params['contest'];
    this.contestService.getRankings(this.contest).subscribe(contest => {
      this.ranks = contest.msg;
      this.ranks.map( x=>{
        if(x.score > 0)
         this.rank.push(x)
      })
    })
    IntervalObservable.create(10000)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.contestService.getRankings(this.contest).subscribe(contest => {
          this.ranks = contest.msg;
        });
      });
  }
  ngOnDestroy() {
    this.alive = false;
  }

}
