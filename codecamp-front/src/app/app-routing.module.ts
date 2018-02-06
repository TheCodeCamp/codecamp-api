import { NgModule } from '@angular/core';
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



const appRoutes: Routes = [
    {path: '',  component: HomeComponent },
    {path: 'about', component: AboutComponent},
    {path: 'register' , component: RegisterComponent},
    {path: 'login' , component: LoginComponent},
    {path: 'problems' , component: PracticeComponent},
    {path: 'contest' , component: ContestComponent},
    {path: 'discuss' , component: DiscussComponent},
    {path: 'profile' , component: ProfileComponent},
    {path: 'ide', component: IdeComponent},
    {path: 'problems/:problem', component: ProblemsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule  {
}
