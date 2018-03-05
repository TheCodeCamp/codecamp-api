import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ContestService } from '../../services/contest.service';


@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {
  code;
  contest;
  problem;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contestService: ContestService,
  ) { }

  ngOnInit() {
    this.code = this.route.snapshot.params['problem'];
    this.contest = this.route.snapshot.params['contest'];
    this.contestService.getProblem(this.code, this.contest).subscribe(data => {
      this.problem = data.problem;
    });
  }

  onSelectSubmit() { 
    this.router.navigate([this.contest, 'submit', this.code]);
  }
}
