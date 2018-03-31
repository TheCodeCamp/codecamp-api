import { Component, OnInit, Input } from '@angular/core';
import { SolutionSubmitComponent } from '../solution-submit.component';
import { ContestService } from '../../../services/contest.service';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.css']
})
export class SolutionComponent implements OnInit {
  data;
  condition;
  constructor(
    private contestService: ContestService
  ) { }

  ngOnInit() {
    this.data = this.contestService.getSolution();
    console.log(this.data)
    if(this.data === 'Accepted')
    {
      this.data = 'Correct Answer';
      this.condition = 'green';
    }
    else if(this.data === 'WA')
    {
      this.data = 'Wrong Answer';
      this.condition = 'red';
    }
    else if(this.data === 'CE')
    {
      this.data = 'Compile Time Error';
      this.condition = 'com';
    }
    else if(this.data === 'TLE') {
      this.data = 'Time Limit Exceed';
      this.condition = 'dark';
    }
    else {
      this.data = 'Runtime Error'
      this.condition = 'blue';
    }
  }

}
