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
    })
  }
  replaceTZ(time) {
    return time && time.replace(/[TZ]|.000/g, '<br>');
  }
  onClickView(id){
    this.router.navigate(['/solution',this.submission.user,id]) 
  }
}



