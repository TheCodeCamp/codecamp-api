import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ContestService } from '../../services/contest.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})

export class ProblemComponent implements OnInit {
  code;
  contest;
  problem;
  base64Image;
  showComment = false;
  caretType = 'fa-caret-right';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contestService: ContestService,
    private domSanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    this.code = this.route.snapshot.params['problem'];
    this.contest = this.route.snapshot.params['contest'];
    this.contestService.getProblem(this.code, this.contest).subscribe(data => {
      this.problem = data.problem;
      this.base64Image = this.problem.image;
      this.base64Image = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
      + this.base64Image);
    });

  }

  onSelectSubmit() {
    this.router.navigate([this.contest, 'submit', this.code]);
  }

  showComments() {
    if (this.showComment) {
      this.showComment = !(this.showComment);
      this.caretType = 'fa-caret-right';
    } else {
      this.showComment = !(this.showComment);
      this.caretType = 'fa-caret-down';
    }
  }
}
