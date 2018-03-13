  import { Component, OnInit, Input } from '@angular/core';
  import { ContestService } from '../../services/contest.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {

  contest;
  problems;
  contestname;
  time;

   //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  countDownDate;
  now;
  end;
  distance;
  days;
  hours;
  minutes;
  seconds;
  times;
  x;


  constructor(
    private contestService: ContestService,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.contest = this.route.snapshot.params['contest'];
    this.contestService.getProblems(this.contest).subscribe(contest => {
     // console.log(contest);
      this.problems = contest.msg[0].questions;
      // this.now = contest.msg[0].startTime;
      //  this.end = contest.msg[0].endTime;
    });
    this.contestService.time.subscribe(time => this.time = time);
    this.contestService.currentContest.subscribe(contest => this.contestname=contest);
    /*this.x = function() {

      // Get todays date and time
        this.countDownDate = this.end - this.now;

        // Find the distance between now an the count down date
        this.distance = this.countDownDate;
        console.log(this.distance);

        // Time calculations for days, hours, minutes and seconds
        this.days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        this.times = this.days + 'd ' + this.hours + 'h ' + this.minutes + 'm ' + this.seconds + 's ';
        return this.times;
    };
    console.log(this.x());*/
    var timer;

    var compareDate = new Date();
    compareDate.setDate(compareDate.getDate() + 7); //just for this demo today + 7 days

    timer = setInterval(function() {
      timeBetweenDates(compareDate);
    }, 1000);

    function timeBetweenDates(toDate) {
      var dateEntered = toDate;
      var now = new Date();
      var difference = dateEntered.getTime() - now.getTime();

      if (difference <= 0) {

        // Timer done
        clearInterval(timer);
      
      } else {
        
        var seconds = Math.floor(difference / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);

        hours %= 24;
        minutes %= 60;
        seconds %= 60;

        $("#days").text(days);
        $("#hours").text(hours);
        $("#minutes").text(minutes);
        $("#seconds").text(seconds);
      }
    }
  }
  onAddProblem() {
    this.router.navigate(['/contest', this.contest, 'addproblem']);
  }
  onSelectProblem(code) {
        this.router.navigate(['/contest', this.contest, code]);
  }
  onDeleteContest() {
    this.contestService.deleteContest(this.contest).subscribe(contest => {
      this.router.navigate(['/contest']);
    });
  }


  onClickRanking() {
    this.router.navigate(['/contest', this.contest, 'ranking']);
  }
}
