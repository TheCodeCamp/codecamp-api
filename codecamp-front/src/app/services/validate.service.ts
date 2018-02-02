import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }
  validateRegister(user){
    if( user.name == undefined ||
        user.username == undefined || 
        user.email_id == undefined ||
        user.college == undefined ||
        user.city == undefined ||
        user.dob == undefined ||
        user.gender == undefined ||
        user.password == undefined ||
        user.confirmpassword == undefined ){
            return false;
    }
    else{
      return true;
    }
  }

  validateEmail(email_id){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email_id).toLowerCase());
  }

  validatePassword(password, confirmpassword){
    if(password != confirmpassword){
      return false;
    }
    else{
      return true;
    }
  }
}

