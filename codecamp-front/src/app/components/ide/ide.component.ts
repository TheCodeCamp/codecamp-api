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

  selectedLanguage = 'c_cpp';
  content: string;
  currentFileUpload;
  value;
  ace;
  output;
  input;
  description;
  language: string;
  constructor() {
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
      const text = document.getElementById('text');
      if (checkBox.checked === true) {
        text.style.display = 'block';
      } else {
        text.style.display = 'none';
      }
    }

    onRun() {
     /* const lang = $('#select').val();
      const editor = this.ace.edit('description');
      this.content = editor.getValue('description');
      const p = this.content;
      const inp = ((document.getElementById('myTextArea') as HTMLInputElement).value);
      this.currentFileUpload = btoa(p);
      const test = {
        input: inp,
        language : lang,
        description: this.currentFileUpload
      }*/
}
}


