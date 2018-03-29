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

  contestname;
  constructor(
    public authService: AuthService,
    private contestService: ContestService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  onAddContest() {
    this.router.navigate(['/contest/add-contest']);
  }/*
  onClickGrab(i){
    this.contestname = i.name;
    this.contestService.changeContest(this.contestname);
    this.router.navigate(['/contest', i.id]);
  }*/
}
