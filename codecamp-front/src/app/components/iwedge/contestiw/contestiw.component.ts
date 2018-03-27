import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ContestService } from '../../../services/contest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contestiw',
  templateUrl: './contestiw.component.html',
  styleUrls: ['./contestiw.component.css']
})
export class ContestiwComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private contestService: ContestService,
    private router: Router
  ) { }

  ngOnInit() {
  }

}
