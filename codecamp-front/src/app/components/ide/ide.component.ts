import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent implements OnInit {


  selectedLanguage: String  =  'c';
  content: string;
  selectLanguage(event: any) {
    this.selectedLanguage = event.target.value;
    if (this.selectedLanguage === 'c') {
      this.content =
    `#include<stdio.h>

    int main()
    {

      printf("Welcome To CodeCamp");

    }`;
  } else if (this.selectedLanguage === 'java') {
    this.content = `import java.util.*;

public class CodeCamp {

   public static void main(String[] args) {

       System.out.println("Welcome To Code Camp");

   }

}
`
      } else {
      this.content = `print("Welcome To CodeCamp")`;
      }

  }

  constructor() {
    this.content =
`#include<stdio.h>

int main()
{

  printf("Welcome To CodeCamp");

}
`
   }

  ngOnInit() {
  }

}
