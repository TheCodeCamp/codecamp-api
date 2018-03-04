import { Component, OnInit, Input } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {

  contest;
  problems;
  contestname;
  constructor(
    private contestService: ContestService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.contest = this.route.snapshot.params['contest'];
    this.contestService.getProblems(this.contest).subscribe(contest => {
      this.problems = contest.msg.questions;
    });
    this.contestService.currentContest.subscribe(contest => this.contestname=contest);
  }
  onAddProblem() {
    this.router.navigate(['/contest', this.contest, 'addproblem']);
  }
  onSelectProblem(code) {
        this.router.navigate(['/contest', this.contest, code]);
  }
  onDeleteContest() {
    this.contestService.deleteContest(this.contest).subscribe(contest =>{
      this.router.navigate(['/contest']);
    })
  }
}
