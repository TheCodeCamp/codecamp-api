import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
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
      email_id: ['', Validators.required]
  });
}
onForgot() {
  const user = {
    email_id: this.form.get('email_id').value, // Email input field
  };
  this.authService.forgetPassword(user).subscribe(data => {
    if (data.success) {
        this._flashMessagesService.show(data.msg, { cssClass: 'alert-success', timeout: 2000 });
        this.router.navigate(['/login']);
    } else {
      this._flashMessagesService.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    }
  });

  //console.log(user);

}
}
