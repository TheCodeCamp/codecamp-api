import { Component, OnInit, trigger, transition, style, animate, state } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { ContestService } from './services/contest.service';
import { Router, NavigationEnd } from '@angular/router';
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
        marginLeft: '0px  '
      })),
      transition('true => false', animate('230ms ease-out')),
      transition('false => true', animate('700ms ease-in-out'))
    ])
  ]
})
export class AppComponent implements OnInit {

  panelVisible;
  menuState:string = 'out';

  constructor(
    private router: Router,
    public progressService: NgProgress,
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
    if(!this.panelVisible)
    // 1-line if statement that toggles the value:
      this.menuState = 'in';
    else  
      this.menuState = 'out';
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
    }
}