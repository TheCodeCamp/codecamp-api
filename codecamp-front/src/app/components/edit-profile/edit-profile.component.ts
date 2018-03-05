import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

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
