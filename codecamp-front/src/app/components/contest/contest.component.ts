import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {


  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  onAddContest() {
    this.router.navigate(['/contest/add-contest']);
  }
  onEditContest() {
    this.router.navigate(['/contest/edit-contest']);
  }
}
