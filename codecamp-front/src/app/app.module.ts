import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {FormControl, FormGroup} from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { PracticeComponent } from './components/practice/practice.component';
import { DiscussComponent } from './components/discuss/discuss.component';
import { ContestComponent } from './components/contest/contest.component';
import { AboutComponent } from './components/about/about.component';

import { AuthService } from './services/auth.service';
import { ValidateService } from './services/validate.service';
import { HttpModule } from '@angular/http';
<<<<<<< HEAD
import { SubmissionComponent } from './components/submission/submission.component';
import { SolutionComponent } from './components/solution/solution.component';
import { RanklistComponent } from './components/ranklist/ranklist.component';
import { IdeComponent } from './components/ide/ide.component';
=======
>>>>>>> 73a9b1d0a1fabb223c70b50431b009c32cb343a5


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    PracticeComponent,
    DiscussComponent,
    ContestComponent,
<<<<<<< HEAD
    AboutComponent,
    SubmissionComponent,
    SolutionComponent,
    RanklistComponent,
    IdeComponent
=======
    AboutComponent
>>>>>>> 73a9b1d0a1fabb223c70b50431b009c32cb343a5
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ValidateService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
