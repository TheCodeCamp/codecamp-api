import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  form: FormGroup;
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _flashMessagesService: FlashMessagesService
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: '',
      email_id: '',
      message: ''
    });
  }
  onSend() {
    const user = JSON.parse(localStorage.getItem('user'));
    const msg = {
    name: user.username,
    email_id: this.form.get('email_id').value,
    message: this.form.get('message').value
    };
   // console.log(this.form.get('name').value)
      // console.log(msg);
      this.authService.sendFeedback(msg).subscribe((res) => {
        // console.log(res);
        if (res.success) {
          this._flashMessagesService.show(res.msg, { cssClass: 'alert-primary', timeout: 10000});
        } else {
          this._flashMessagesService.show(res.msg, { cssClass: 'alert-danger', timeout: 10000});
        }
        this.router.navigate(['/']);
      });
  }
}
