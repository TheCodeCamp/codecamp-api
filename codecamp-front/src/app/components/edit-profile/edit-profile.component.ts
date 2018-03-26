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
  form: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
     this.user = authService.getProfile().subscribe(profile => {
       this.user = profile.msg;

           //console.log(profile);
     });
     this.createForm();
      // console.log(this.user);
  }
  ngOnInit() {
  }
  createForm() {
    this.form = this.formBuilder.group({
        name: this.user.name,
        email_id: this.user.email_id,
        username: this.user.username,
        dob: this.user.dob,
        gender: this.user.gender,
        city: this.user.city,
        college: this.user.college,
        joinedOn: this.user.joinedOn

    })
  }
  replaceTZ(time) {
    if(time !== undefined ){
    let t1 = time.replace(/[TZ]|.000/g , ' ');
    t1 = t1.split(' ');
    return t1[0];
    }
  }
  onEdit(){
    const usr = {

      name: this.form.get('name').value ? this.form.get('name').value : this.user.name,
      username: this.form.get('username').value ? this.form.get('username').value : this.user.username,
      email_id: this.form.get('email_id').value ? this.form.get('email_id').value : this.user.email_id,
      college: this.form.get('college').value ? this.form.get('college').value : this.user.college,
      city: this.form.get('city').value ? this.form.get('city').value : this.user.city,
      dob: this.form.get('dob').value ? this.form.get('dob').value : this.user.dob,
      gender: this.form.get('gender').value ? this.form.get('gender').value : this.user.gender,
      joinedOn: this.form.get('joinedOn').value ? this.form.get('joinedOn').value : this.user.joinedOn
    }
    console.log(usr);

  }
}
