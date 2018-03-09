import { Component, OnInit, trigger, transition, animate, style,state } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ContestService } from '../../services/contest.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('panelInOut', [
      state('true', style({
        marginLeft: '240px'
      })),
      state('false', style({
        marginLeft: '0px'
      })),
      transition('true => false', animate('300ms ease-in-out')),
      transition('false => true', animate('600ms ease-in-out'))
    ])
  ]
})
export class NavbarComponent implements OnInit{

  user: any;
  usern;
  toggle = true;
  constructor(
    public authService: AuthService,
    private router: Router,
    private contestService: ContestService
  ) {
    /*this.authService.name.subscribe(value => {
      this.user = value;

    });*/
    this.user = authService.getProfile().subscribe(profile => {
      this.usern = profile.msg;
       //console.log(JSON.stringify(this.user));
    });
  }

  ngOnInit() {
    this.contestService.toggle.subscribe(toggle => this.toggle = toggle);
  }

  onLogoutClick() {
    this.authService.logout(); // Logout user
    this.router.navigate(['/']); // Navigate back to home page
  }
  onUndefined() {

  }
  onToggle() {
    this.toggle = this.toggle? false:true;
    this.contestService.ontoggle(this.toggle);
  }

}
