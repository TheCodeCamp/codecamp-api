import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-iwedge',
  templateUrl: './iwedge.component.html',
  styleUrls: ['./iwedge.component.css']
})
export class IwedgeComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    function parallax_height() {
      var scroll_top = $(this).scrollTop();
      var sample_section_top = $(".sample-section").offset().top;
      var header_height = $(".sample-header-section").outerHeight();
      $(".sample-section").css({ "margin-top": header_height });
      $(".sample-header").css({ height: header_height - scroll_top });
    }
    parallax_height();
    $(window).scroll(function() {
      parallax_height();
    });
    $(window).resize(function() {
      parallax_height();
    }); 
  }

  onParticipateClick(){
    this.router.navigate(['/iwedge/contest']);
  }
}
