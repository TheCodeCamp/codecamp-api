import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
     this.user = authService.getprofile().subscribe(profile => {
       this.user = profile.username;
     });
      console.log(this.user);
  }

  ngOnInit() {
  }

}
