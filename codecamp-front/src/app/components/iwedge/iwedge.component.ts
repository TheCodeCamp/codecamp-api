import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-iwedge',
  templateUrl: './iwedge.component.html',
  styleUrls: ['./iwedge.component.css']
})
export class IwedgeComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    
  }
  onParticipateClick(){
    this.router.navigate(['/iwedge/contest']);
  }
}
