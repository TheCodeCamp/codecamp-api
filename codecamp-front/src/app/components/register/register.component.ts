import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  // message;
  // messageClass;
  showPassword = false;
  text = 'password';
  iconOfHide = 'fa-eye-slash';
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _flashMessagesService: FlashMessagesService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email_id: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(30), // Maximum length is 30 characters
        this.validateEmail // Custom validation
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
      username: ['', Validators.required],
      confirm: ['', Validators.required],
      college: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      city: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm')});
  }



  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true }; // Return as invalid email
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true }; // Return as error: do not match
      }
    };
  }
  onSignupSubmit() {

    const user = {
      username: this.form.get('username').value,
      email_id: this.form.get('email_id').value,
      name: this.form.get('name').value,
      college: this.form.get('college').value,
      password: this.form.get('password').value,
      dob: this.form.get('dob').value,
      city: this.form.get('city').value,
      gender: this.form.get('gender').value,
      joinedOn: Date.now()
    };
    this.authService.registerUser(user).subscribe(data => {
      if (!data.success) {
        if(data.msg.errmsg.match(/(username|dup)/)) {
          this._flashMessagesService.show('Username already exists', { cssClass: 'alert-danger', timeout: 5000});
        } else if(data.msg.errmsg.match(/(email)/)) {
          this._flashMessagesService.show('Email Id already exists', { cssClass: 'alert-danger', timeout: 5000});
        }
      } else {
        this._flashMessagesService.show('Registered Successfully', { cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['/login']);
      }
    });
  }

  onClick() {
    this.showPassword = !this.showPassword;
    // console.log(this.showPassword);
    if ( this.showPassword ) {
    this.text = 'text';
    this.iconOfHide = 'fa-eye';
    } else {
    this.text = 'password';
    this.iconOfHide = 'fa-eye-slash';
    }
  }
}
