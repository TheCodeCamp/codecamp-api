import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ContestService } from '../../services/contest.service';

@Component({
  selector: 'app-add-contest',
  templateUrl: './add-contest.component.html',
  styleUrls: ['./add-contest.component.css']
})
export class AddContestComponent implements OnInit {

  form: FormGroup;
  username: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private contestService: ContestService
  ) { }

  ngOnInit() {
    this.createForm();
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.msg.username; // Used when creating new blog posts and comments
    });
  }
  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onAddContestSubmit() {
    const contest = {
      // username: this.username,
      name: this.form.get('name').value,
      id: this.form.get('id').value,
      startTime: this.form.get('startTime').value,
      endTime: this.form.get('endTime').value,
      description: this.form.get('description').value
    };
    this.contestService.addContest(contest).subscribe(data => {
      if (!data.success) {
        console.log(data.msg);
      } else {
        this.router.navigate(['/iwedge/contest']);
      }
    });
  }
}
