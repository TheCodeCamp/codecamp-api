import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  message = false;
  messageClass;

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
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
      username: ['', Validators.required]
  });
}

  onSignInSubmit() {
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    };
    this.authService.loginUser(user).subscribe(data => {
      if (!data.success) {
        this._flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000});
      } else {
        this.authService.storeUserData(data.token, data.user);
            NavbarComponent.updateName.next(true); // here!
            this.router.navigate(['/']);
           }     // Navigate to dashboard view
      });
  }
}
