import { Component, OnInit, ViewChild,NgModule } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AceEditorModule } from 'ng2-ace-editor';
import { FormsModule } from '@angular/forms';
import { ContestService } from '../../services/contest.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent implements OnInit {

  selectedLanguage = 'c_cpp';
  content: string;
  test;
  currentFileUpload;
  status;
  value;
  ace;
  output;
  input;
  description;
  language: string;
  constructor(
    private contestService: ContestService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.content =
`#include<stdio.h>

int main()
{

  printf("Welcome To CodeCamp");

} `;
   }

   ngOnInit() {

  }

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

    myFunction() {
      const checkBox = <any> document.getElementById('myCheck');
      const text = document.getElementById('input');
      if (checkBox.checked === true) {
        text.style.display = 'block';
      } else {
        text.style.display = 'none';
      }
    }

    onRun() {
      const lang = $('#select').val();
      const p = this.content;
      this.test = (document.getElementById('myTextarea') as HTMLInputElement).value;
      console.log(this.test);
      this.currentFileUpload = btoa(p);
      const test1 = {
        input: this.test,
        language : lang,
        description: this.currentFileUpload
      }
      this.contestService.addTest(test1).subscribe(data => {
        this.contestService.setTest(data.msg);
      });

      const text = document.getElementById('myOutputArea');
        text.style.display = 'block';
}
}


