import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: string;
  username: string;
  email_id: string;
  college: string;
  password: string;
  dob: string;
  city: string;
  joinedOn: string;
  gender: string;
  confirmpassword: string;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email_id: this.email_id,
      college: this.college,
      password: this.password,
      joinedOn: '12/10/15',
      dob: this.dob,
      city: this.city,
      gender: this.gender,
      confirmpassword: this.confirmpassword
    }

    //Required Fields
    if(!this.validateService.validateRegister(user)){
        console.log('Please fill in all fields');
        return false;
    }

    if(!this.validateService.validateEmail(user.email_id)){
      console.log('Please use a valid email');
        return false;
    }
    if(!this.validateService.validatePassword(user.password,user.confirmpassword)){
      console.log('password mismatch');
      return false;
    }
    
    //Register User
      this.authService.registerUser(user).subscribe(data => {
        if(data.success){
          console.log('User Registered');
          this.router.navigate(['/login']);
        } else{
          console.log('Something wents wrong');
          this.router.navigate(['/register']);
        }
      });

  }

}
