import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-sol',
  templateUrl: './view-sol.component.html',
  styleUrls: ['./view-sol.component.css']
})
export class ViewSolComponent implements OnInit {

  id;
  soln;
  constructor(
    private contestService: ContestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.contestService.getSoln(this.id).subscribe((data)=>{
      this.soln = data.msg;
    })
  }
}
