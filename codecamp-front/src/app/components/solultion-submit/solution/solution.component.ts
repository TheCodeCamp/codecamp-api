import { Component, OnInit, Input } from '@angular/core';
import { SolultionSubmitComponent } from '../solultion-submit.component';
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
    if(this.data[0]==='C')
    this.condition = 'green';
    else if(this.data[0] === 'w')
    this.condition = 'red';
    else
    {
        this.data = "Compile Time Error";
      this.condition = 'blue';
    }
  }

}
