import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contest',
  templateUrl: './add-contest.component.html',
  styleUrls: ['./add-contest.component.css']
})
export class AddContestComponent implements OnInit {

  form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onAddContestSubmit() {
    
  }
}
