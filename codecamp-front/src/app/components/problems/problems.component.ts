  import { Component, OnInit, Input } from '@angular/core';
  import { ContestService } from '../../services/contest.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { take, map } from 'rxjs/operators';
import * as $ from 'jquery';


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

  // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  // Add 'implements OnInit' to the class.
  countDownDate;
  now;
  end;
  distance;
  days = 0;
  hours;
  minutes;
  seconds;
  times;
  time_hr;
  time_day;
  time_min;
  time_sec;
  start;
  x;
  ticks = 0;
  typeOfNow = 'Contest Will Start In';
  conditionToShowProblem = false;
  user;
  username;
  constructor(
    private contestService: ContestService,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {

   }

  ngOnInit() {
    this.contest = this.route.snapshot.params['contest'];
    this.user = JSON.parse(localStorage.getItem('user'));
    this.username = this.user.username;
    this.contestService.getProblems(this.contest, this.username).subscribe((contest) => {
          this.problems = contest.msg[0].questions;
        this.start = new Date(contest.msg[0].startTime);
        this.end = new Date(contest.msg[0].endTime);
        // console.log(this.start);
        // console.log(this.end);
        var timer;

        if (this.start > new Date()) {
            var compareDate = this.start;
        } else if (this.start <= new Date() && this.end >= new Date()) {
          this.typeOfNow = 'Contest Will End In';
          var compareDate = this.end;
          this.conditionToShowProblem = true;
        } else {
          this.typeOfNow = 'Contest Ended';
          this.conditionToShowProblem = true;
        }
        // compareDate.setDate(this.end.getDate()); //just for this demo today + 7 days
        // console.log(compareDate);
       /* timer = setInterval(function() {
          timeBetweenDates(compareDate);
        }, 1000);*/
          setInterval((() => {
          if (compareDate) {
          var dateEntered = new Date(compareDate);
          var now = new Date();
          var difference = dateEntered.getTime() - now.getTime();

          if (difference <= 0) {

            // Timer done
            clearInterval(timer);
            this.times = '';
          } else {

            var second = Math.floor(difference / 1000);
            var minute = Math.floor(second / 60);
            var hour = Math.floor(minute / 60);
            var day = Math.floor(hour / 24);

            hour %= 24;
            minute %= 60;
            second %= 60;
            // console.log(day,hour,minute,second);
              // this.days = day;
              // this.hours = hour;
              // this.minutes = minute;
              // this.seconds = second;
              /*$("#day").text(day);
              $("#hour").text(hour);
              $("#minute").text(minute);
              $("#second").text(second);
              var temp = String(day) + ' days ' + String(hour) + ' hr ' +String(minute) + ' min ' +String(second) + ' sec';
              ////this.contestService.time.next(temp);
              //this.contestService.time.subscribe(value => this.times = value);*/
              this.time_day = day ;
              this.time_hr = hour ;
              this.time_min = minute ;
              this.time_sec = second ;
              this.times = String(day) + ' days ' + String(hour) + ' hr ' + String(minute) + ' min ' + String(second) + ' sec';
          }
          }
        }), 1000);

    });
    this.contestService.currentContest.subscribe(contest => this.contestname = contest);


  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }
  tickerFunc(tick) {
    this.ticks = tick;
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

  onRefresh() {
    this.router.navigate(['/contest', this.contest]);
  }
}
