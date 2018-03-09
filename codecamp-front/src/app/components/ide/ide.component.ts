import { Component, OnInit, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AceEditorModule } from 'ng2-ace-editor';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent implements OnInit {
/*
  selectedLanguage = 'c_cpp';
  content: string;
  currentFileUpload;
  value;
  ace;
  constructor() {
    this.content =
`#include<stdio.h>

int main()
{

  printf("Welcome To CodeCamp");

} `;
   }
*/
   ngOnInit() {

  }
/*
  selectLanguage(event) {
    this.selectedLanguage = event.target.value;

    if (this.selectedLanguage === 'c_cpp') {
      this.content =
      `#include<stdio.h>
//#include<bits/stdc++.h>
//using namespace std;
int main()
{

    printf("Welcome To CodeCamp");
    return 0;
}`;
    } else if (this.selectedLanguage === 'java') {
      this.content =
        `import java.util.*;

public class Solution {

    public static void main(String[] args) {

        System.out.print("Welcome To CodeCamp");

    }

}
        `;
      } else if (this.selectedLanguage === 'python') {
      this.content = `print("Welcome To CodeCamp")`;
      }
  }
onRun() {
  const lang = $('#select').val();
  const editor = this.ace.edit('description');
    this.content = editor.getValue('description');
    const p = this.content;
    this.currentFileUpload = btoa(p);
}
*/
}





/*

import { Component, OnInit, ViewChild, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ContestService } from '../../services/contest.service';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AceEditorModule } from 'ng2-ace-editor';
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



  onFileChange(event){
  let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
         this.value = reader.result.split(',')[1];
        };
      }
    }

  onClickSubmit() {
    const lang = $('#select').val();
    const editor =ace.edit('description');
    this.content = editor.getValue('description');
    const p = this.content;
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
*/
