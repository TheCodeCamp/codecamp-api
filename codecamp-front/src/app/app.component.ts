  import { Component, OnInit, trigger, transition, style, animate, state } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { ContestService } from './services/contest.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('panelInOut', [
      state('true', style({
        marginLeft: '240px'
      })),
      state('false', style({
        marginLeft: '0px'
      })),
      transition('true => false', animate('230ms ease-out')),
      transition('false => true', animate('700ms ease-in-out'))
    ])
  ]
})
export class AppComponent implements OnInit {

  panelVisible;
  p= false;
  innerWidth: any;
  constructor(public progressService: NgProgress,
  private contestService: ContestService){

  }
  ngOnInit(){
    this.contestService.toggle.subscribe(toggle => this.panelVisible = toggle);
    this.progressService.start();
    setTimeout(() => {
      this.progressService.set(0.1);
    }, 1000);
    setTimeout(() => {
      this.progressService.inc(0.2);
    }, 2000);
  
  }
}
