import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {

  private loggedIn: boolean;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Function to check if user is authorized to view route
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ){
    // Check if user is logge din
    if (this.authService.checkisAdmin() ===false) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
