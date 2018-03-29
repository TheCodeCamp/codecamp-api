import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

  submission;
  submit;
  glyph;
  v =
  `<div class="row">
  <div class="col-md-4 head">
      Time/Date
    </div>
    <div class="col-md-2 head">
      Res
    </div>
    <div class="col-md-3 head">
      Lang
    </div>
    <div class="col-md-3 head">
      Code
    </div>
    </div>
    <div class="row sol text-center" *ngFor="let i of submit">
      <div class="col-md-4" [innerHTML]="replaceTZ(i.submitted_on)">

      </div>
      <div class="col-md-2">

        <i class="fa fa-times" aria-hidden="true" *ngIf="i.status === 'WA'"></i>
        <i class="fa fa-check" aria-hidden="true" *ngIf="i.status === 'Accepted'"></i>
        <i class="fa fa-exclamation-circle" aria-hidden="true" *ngIf="i.status === 'RE'"></i>
        <i class="fa fa-exclamation-triangle" aria-hidden="true" *ngIf="i.status === 'CE'"></i>
        <i class="fa fa-clock-o" aria-hidden="true" *ngIf="i.status === 'TLE'"></i>
      </div>
      <div class="col-md-3">
        {{i.language.toUpperCase()}}
      </div>
      <div class="col-md-3">
        <button (click)="onClickView(i.id)">View</button>
      </div>
      <hr>
    </div>
`;
  constructor(
    private contestService: ContestService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.submission = {
      user :  JSON.parse(localStorage.getItem('user')).username,
      problem : this.route.snapshot.params['problem'],
      contest : this.route.snapshot.params['contest']
    }
    this.contestService.getSubmission(this.submission).subscribe((data)=>{
      this.submit = data.msg;
      console.log(this.submit)
    })
  }
  replaceTZ(time) {
    return time && time.replace(/[TZ]|.000/g, '<br>');
  }
  onClickView(id){
    this.router.navigate(['/solution',this.submission.user,id]) 
  }
}



