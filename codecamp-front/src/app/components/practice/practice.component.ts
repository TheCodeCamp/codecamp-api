import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  problems;
  p;
  prob = new Array();
  constructor(
    private contestService: ContestService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.contestService.getPracticeProblems().subscribe((data) => {
      this.problems = data.msg;
      for(let i = 0; i<this.problems.length; i++){
        
        this.prob.push({
          code: this.problems[i][0].code,
          name: this.problems[i][0].name
        });
        
      }
      console.log(this.prob);
    })
  }
}
