import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes} from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {FormControl, FormGroup} from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';
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
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

import { AuthService } from './services/auth.service';
import { ContestService } from './services/contest.service';

import { HttpModule } from '@angular/http';
import { IdeComponent } from './components/ide/ide.component';
import { ProblemsComponent } from './components/problems/problems.component';
import { AddContestComponent } from './components/add-contest/add-contest.component';
import { EditContestComponent } from './components/edit-contest/edit-contest.component';
import { SubmissionComponent } from './components/submission/submission.component';
import { RanklistComponent } from './components/ranklist/ranklist.component';
import { SolutionComponent } from './components/solution-submit/solution/solution.component';
import { ProblemComponent } from './components/problem/problem.component';
import { AddProblemComponent } from './components/add-problem/add-problem.component';


import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';

import { AdminGuard } from './guards/admin.guard';
import { SolutionSubmitComponent } from './components/solution-submit/solution-submit.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';
import { BrowserXhr } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { IwedgeComponent } from './components/iwedge/iwedge.component';
import { ContestiwComponent } from './components/iwedge/contestiw/contestiw.component';
//import { CountDown } from 'ng2-date-countdown';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ViewSolComponent } from './components/view-sol/view-sol.component';
import { CommentComponent } from './components/comment/comment.component';


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
    AboutComponent,
    IdeComponent,
    ProblemsComponent,
    AddContestComponent,
    EditContestComponent,
    SubmissionComponent,
    RanklistComponent,
    SolutionComponent,
    ProblemComponent,
    AddProblemComponent,
    SolutionSubmitComponent,
    PreloaderComponent,
    SidebarComponent,
    EditProfileComponent,
    IwedgeComponent,
    ContestiwComponent,
    //CountDown
    ContactComponent,
    FooterComponent,
    NotificationComponent,
    ForgotPasswordComponent,
    ViewSolComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AceEditorModule,
    NgProgressModule,
    BrowserAnimationsModule,
    FlashMessagesModule.forRoot()
    //NgxPaginationModule
  ],
  providers: [ AuthService, AuthGuard, NotAuthGuard, AdminGuard, ContestService,
    {provide: BrowserXhr, useClass: NgProgressBrowserXhr}],
  bootstrap: [AppComponent]
})
export class AppModule { }
