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
  dob;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
     this.user = authService.getProfile().subscribe(profile => {
       this.user = profile.msg;
       this.dob = profile.msg.dob && profile.msg.dob.replace(/[TZ]|.000/g, ' ');
    });
  }

  ngOnInit() {
    }
    onSubmitSel() {
      this.router.navigate([this.user.username, 'edit-profile']);
    }
}
