import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


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
import { IdeComponent } from './components/ide/ide.component';
import { ProblemsComponent } from './components/problems/problems.component';
import { AddContestComponent } from './components/add-contest/add-contest.component';
import { EditContestComponent } from './components/edit-contest/edit-contest.component';
import { ProblemComponent } from './components/problem/problem.component';
import { AddProblemComponent } from './components/add-problem/add-problem.component';

import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/not-auth.guard';
import { SolutionSubmitComponent } from './components/solution-submit/solution-submit.component';
import { SolutionComponent } from './components/solution-submit/solution/solution.component';
import { RanklistComponent } from './components/ranklist/ranklist.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { IwedgeComponent } from './components/iwedge/iwedge.component';
import { ContestiwComponent } from './components/iwedge/contestiw/contestiw.component';
import { ContactComponent } from './components/contact/contact.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ViewSolComponent } from './components/view-sol/view-sol.component';
import { AdminGuard } from './guards/admin.guard';


const appRoutes: Routes = [
    {
      path: '',
      component: HomeComponent
    },
    {
      path: 'about',
      component: AboutComponent
    },
    {
      path: 'register',
      component: RegisterComponent,
      canActivate: [NotAuthGuard]
    },
    {
      path: 'login',
      component: LoginComponent,
      canActivate: [NotAuthGuard]
    },
    {
      path: 'practice',
      component: PracticeComponent
    },
    {
      path: 'practice/:contest/:problem',
      component: ProblemComponent
    },
    {
      path: 'iwedge',
      component: IwedgeComponent
    },
    {
      path:'iwedge/contest',
      component: ContestiwComponent

    },
    {
      path: 'contest',
      component: ContestComponent
    },
    {
      path: 'discuss',
      component: DiscussComponent
    },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'forgot-password',
      component: ForgotPasswordComponent
    },
    {
      path: 'ide',
      component: IdeComponent
    },
    {
      path: 'contact',
      component: ContactComponent
    },
    {
      path: ':username/edit-profile',
      component: EditProfileComponent
    },
    {
      path: ':contest/submit/:code',
      component: SolutionSubmitComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'submit/complete',
      component: SolutionComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'contest/add-contest',
      component: AddContestComponent,
      canActivate: [AdminGuard]
    },
    {
      path: 'contest/:contest',
      component: ProblemsComponent
    },
    {
      path: 'contest/:contest/addproblem',
      component: AddProblemComponent,
      canActivate: [AdminGuard]
    },
    {
      path: 'contest/:contest/ranking',
      component: RanklistComponent
    },
    {
      path: 'contest/:contest/:problem',
      component: ProblemComponent
    },
    {
      path: 'contest/:contest/ranklist',
      component: RanklistComponent
    },
    {
      path: 'contest/edit/:edit-contest',
      component: EditContestComponent,
      canActivate: [AuthGuard]
    },
      { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule  {
}
