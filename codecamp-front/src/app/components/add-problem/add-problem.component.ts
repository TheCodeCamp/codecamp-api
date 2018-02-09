import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContestService } from '../../services/contest.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.css']
})
export class AddProblemComponent implements OnInit {
  form: FormGroup;
  contest;
  constructor(
    private contestService: ContestService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.createForm();
    this.contest = this.route.snapshot.params['contest'];
  }

  createForm() {
    this.form = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      level: ['', Validators.required],
      description: ['', Validators.required],
      input_format: ['', Validators.required],
      output_format: ['', Validators.required],
      constraints: ['', Validators.required],
      input_example: ['', Validators.required],
      output_example: ['', Validators.required],
      explanation_example: ['', Validators.required],
      timelimit: ['', Validators.required],
      sourcelimit: ['', Validators.required],
      author: ['', Validators.required],
      Input: ['', Validators.required],
      Output: ['', Validators.required]
    });
  }

  onAddProblemSubmit() {
    const problem = {
      code: this.form.get('code').value,
      name: this.form.get('name').value,
      level: this.form.get('level').value,
      description: this.form.get('description').value,
      input_format: this.form.get('input_format').value,
      output_format: this.form.get('output_format').value,
      constraints: this.form.get('constraints').value,
      input_example: this.form.get('input_example').value,
      output_example: this.form.get('output_example').value,
      explanation_example: this.form.get('explanation_example').value,
      timelimit: this.form.get('timelimit').value,
      sourcelimit: this.form.get('sourcelimit').value,
      author: this.form.get('author').value,
      Input: this.form.get('Input').value,
      Output: this.form.get('Output').value,
    };

    this.contestService.addProblem(problem, this.contest).subscribe(data => {
      if (!data.success) {
        console.log(data.msg);
      } else {
        this.router.navigate(['/contest', this.contest]);
      }
    });
  }
}