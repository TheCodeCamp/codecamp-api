import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


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
    private router: Router,
    private _flashMessagesService: FlashMessagesService
  ) {
     this.user = authService.getProfile().subscribe(profile => {
       this.user = profile.msg;

          // console.log(profile);
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

    });
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
      contact_number: this.form.get('contact_number').value ? this.form.get('contact_number').value : this.user.contact_number,
      college: this.form.get('college').value ? this.form.get('college').value : this.user.college,
      city: this.form.get('city').value ? this.form.get('city').value : this.user.city,
      dob: this.form.get('dob').value ? this.form.get('dob').value : this.user.dob,
      gender: this.form.get('gender').value ? this.form.get('gender').value : this.user.gender,
      joinedOn: this.form.get('joinedOn').value ? this.form.get('joinedOn').value : this.user.joinedOn
    };

    this.authService.editUser(usr).subscribe(data => {
      // console.log(data);
      this._flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 2000});
      this.router.navigate(['/profile']);
    });
  }
}
