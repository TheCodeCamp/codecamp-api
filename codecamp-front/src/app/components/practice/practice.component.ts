import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  problems;
  p;
  constructor(
    private contestService: ContestService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.contestService.getPracticeProblems().subscribe((data) => {
      this.problems = data.msg;
    })
  }

  onSelectProblem(contest,code){
    this.router.navigate(['/practice', contest,code]);
  } 
}
