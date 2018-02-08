import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
     this.user = authService.getProfile().subscribe(profile => {
       this.user = profile.msg;
        //console.log(JSON.stringify(this.user));
     });
      //console.log(this.user);
  }

  ngOnInit() {

    }

}
