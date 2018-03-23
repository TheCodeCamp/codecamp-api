import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../../services/contest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ide-submit',
  templateUrl: './ide-submit.component.html',
  styleUrls: ['./ide-submit.component.css']
})
export class IdeSubmitComponent implements OnInit {
  status;
  output;
  data;
  constructor(
    private contestService: ContestService,
    private router: Router
  ) { }

  ngOnInit() {
    //this.data = this.contestService.getTest();
    this.status = this.data.status;
    this.output = this.data.output;
  }

}
