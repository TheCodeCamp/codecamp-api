import { Component } from '@angular/core';

@Component({
  selector : 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent {
  countDownDate = new Date('Sep 5, 2018 15:37:25').getTime();
  now;
  distance;
  days;
  hours;
  minutes;
  seconds;
  time;
// Update the count down every 1 second
    x = function() {

    // Get todays date and time
      this.now = new Date().getTime();

      // Find the distance between now an the count down date
      this.distance = this.countDownDate - this.now;

      // Time calculations for days, hours, minutes and seconds
      this.days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      this.time = this.days + 'd ' + this.hours + 'h ' + this.minutes + 'm ' + this.seconds + 's ';
      return this.time;
  }
}
