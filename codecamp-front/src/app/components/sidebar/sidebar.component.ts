import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ContestService } from '../../services/contest.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('panelInOut', [
        transition('void => *', [
            style({transform: 'translateX(-100%)'}),
            animate('500ms ease-in')
        ]),
        transition('* => void', [
            animate('500ms ease-out', style({transform: 'translateX(-100%)'}))
        ])
    ])
  ]

})
export class SidebarComponent implements OnInit {

  profile;
  panelVisible;
  constructor(public authService: AuthService,
  private contestService: ContestService) {

  }

  ngOnInit() {


    this.contestService.toggle.subscribe(toggle => this.panelVisible = toggle);
   }

   onClick() {
    // Do something relevant with the object...
    return false;
    }
}
