import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ranklist',
  templateUrl: './ranklist.component.html',
  styleUrls: ['./ranklist.component.css']
})
export class RanklistComponent implements OnInit {

  contest;
  problems;
  constructor(
    private contestService: ContestService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute ) { }

  ngOnInit() {
    this.contest = this.route.snapshot.params['contest'];
    this.contestService.getRankings(this.contest).subscribe(contest => {
      this.problems = contest.msg;
    });
  }

}
