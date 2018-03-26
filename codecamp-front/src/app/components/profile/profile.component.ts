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
       this.user.dob = this.replaceTZ(this.user.dob);
       this.user.joinedOn = this.replaceTZ(this.user.joinedOn);
     });
  }

  ngOnInit() {
    }
    onSubmitSel() {
      this.router.navigate([this.user.username, 'edit-profile']);
    }
    replaceTZ(time) {
      if(time !== undefined ){
      let t1 = time.replace(/[TZ]|.000/g , ' ');
      t1 = t1.split(' ');
      return t1[0];
      }
    }
}
