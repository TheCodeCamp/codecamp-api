  import { Component, OnInit, ViewChild, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ContestService } from '../../services/contest.service';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-solultion-submit',
  templateUrl: './solultion-submit.component.html',
  styleUrls: ['./solultion-submit.component.css']
})
export class SolultionSubmitComponent implements OnInit {
  selectedLanguage = 'c_cpp';
  content;
  problem;
  contest;
  username;
  solution;
  language: string;
  currentFileUpload;
  value;
  @ViewChild('userFile') user_file;
  constructor(
    private contestService: ContestService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
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

  selectLanguage(event) {
    this.selectedLanguage = event.target.value;
    
    if (this.selectedLanguage == 'c_cpp') { 
      this.content =
      `#include<stdio.h>

      int main()
      {

        printf("Welcome To CodeCamp");

      }`;
    } else if (this.selectedLanguage == 'java') {
      this.content =
        `import java.util.*;

        public class Solution {

          public static void main(String[] args) {

              System.out.print("Welcome To CodeCamp");

          }

        }
        `;
      } else if (this.selectedLanguage == 'python') {
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

    this.content = document.getElementsByClassName('ace_content');
    const p = this.content[0].innerText;
    if (this.value) {
      this.currentFileUpload = this.value;
    } else {
      this.currentFileUpload = btoa(p);
    }
    const solution = {
      problem : this.problem,
      contest: this.contest,
      username: this.username,
      language: lang,
      description: this.currentFileUpload
    };
    this.contestService.addSolution(solution).subscribe(data => {
      this.contestService.setSolution(data.msg);
      this.router.navigate(['/submit/complete']);
    });
  }
}
