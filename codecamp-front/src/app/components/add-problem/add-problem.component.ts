import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContestService } from '../../services/contest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-add-problem',
  templateUrl: './add-problem.component.html',
  styleUrls: ['./add-problem.component.css']
})
export class AddProblemComponent implements OnInit {
  form: FormGroup;
  contest;
  Input;
  Output;
  image;
  constructor(
    private contestService: ContestService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _flashMessagesService: FlashMessagesService
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
      Output: ['', Validators.required],
      score: ['', Validators.required]
    });
  }
  onFileChange1(event) {
    let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
           this.Input = reader.result.split(',')[1];
          };
        }
      }
  onFileChange2(event) {
    let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.Output = reader.result.split(',')[1];
          };
        }
      }

  onFileChange3(event) {
    let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.image = reader.result.split(',')[1];
          };
        }
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
      testCaseInput: atob(this.Input),
      testCaseOutput: atob(this.Output),
      image: this.image,
      score: this.form.get('score').value
    };


    this.contestService.addProblem(problem, this.contest).subscribe(data => {
      if (!data.success) {
        this._flashMessagesService.show(data.msg, { cssClass: 'alert-danger' } );
      } else {
        this._flashMessagesService.show(data.msg, { cssClass: 'alert-success' } );
        this.router.navigate(['/contest', this.contest]);
      }
    });
  }
}
