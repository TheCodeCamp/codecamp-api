import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContestService } from '../../services/contest.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  form: FormGroup;
  constructor(
    private contestService: ContestService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }
  comments = [];
  code;
  contest;
  username;
  isAdmin;
  ngOnInit() {
    this.code = this.route.snapshot.params['problem'];
    this.contest = this.route.snapshot.params['contest'];
    this.username = JSON.parse(localStorage.getItem('user'));
    this.isAdmin = this.username.isAdmin;
    this.contestService.getComments(this.code, this.contest).subscribe((comment) => {
      if (comment.success) {
        this.comments = comment.msg;
        // console.log(comment);
      }
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(100)
      ])]
    });
  }

  onCommentSubmit() {
    const comment = this.form.get('comment').value;
    console.log(comment);
    this.contestService.postComments(this.code, this.contest, comment, this.username)
    .subscribe((comments) => {
      console.log(comments);
    });
    this.router.navigate([`/contest/${this.contest}/${this.code}`]);
  }

  onDeleteComment(comment, user) {
    if (this.isAdmin) {
      const comments = { comment : comment, username : user };
      console.log(comments);
      this.contestService.deleteComments(this.code, this.contest, comments)
      .subscribe((res) => {
        console.log(res);
      });
      this.router.navigate([`/contest/${this.contest}/${this.code}`]);
    }
  }
}
