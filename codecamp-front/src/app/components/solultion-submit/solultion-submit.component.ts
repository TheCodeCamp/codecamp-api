import { Component, OnInit, ViewChild} from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ContestService } from '../../services/contest.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-solultion-submit',
  templateUrl: './solultion-submit.component.html',
  styleUrls: ['./solultion-submit.component.css']
})
export class SolultionSubmitComponent implements OnInit {
  selectedLanguage =  'c_cpp';
  content: string;
  problem;
  contest;
  username;
  language: string;
  formData;
  currentFileUpload;
  value;
  @ViewChild('userFile') user_file;
  constructor(
    private contestService: ContestService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.content = `#include<stdio.h>

    int main()
    {
      printf("Welcome To CodeCamp");
    }
    `;
  }

  ngOnInit() {
    this.problem = this.route.snapshot.params['code'];
    this.contest = this.route.snapshot.params['contest'];
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.msg.username; // Used when creating new blog posts and comments
    });
  }

  selectLanguage(event: any) {
    this.selectedLanguage = event.target.value;
    if (this.selectedLanguage === 'c_cpp') { 
      this.content =
      `#include<stdio.h>

      int main()
      {

        printf("Welcome To CodeCamp");

      }`;
    } else if (this.selectedLanguage === 'java') {
      this.content =
        `import java.util.*;

        public class CodeCamp {

          public static void main(String[] args) {

              System.out.println("Welcome To Code Camp");

          }

        }
        `;
      } else if (this.selectedLanguage === 'python') {
      this.content = `print("Welcome To CodeCamp")`;
      }
  }
  onFileChange(event){
  let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
         this.value = reader.result.split(',')[1];
        };
      }
    }
  onClickSubmit() {
    const lang = $('#select').val();
    if (this.value) {
      this.currentFileUpload = this.value;
    } else {
      this.currentFileUpload = btoa(this.content);
    }
    const solution = {
      problem : this.problem,
      contest: this.contest,
      username: this.username,
      language: lang,
      description: this.currentFileUpload
    };
    this.contestService.addSolution(solution).subscribe(data => {
      if (!data.success) {
        console.log(data.msg);
      } else {
        console.log(data.msg);
      }
    });
  }
}
