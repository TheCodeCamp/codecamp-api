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
  constructor(
    private contestService: ContestService
  ) { }

  ngOnInit() {
    this.data = this.contestService.getSolution();
  }

}
