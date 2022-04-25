import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { IndexComponent } from './components/index/index.component';

const routes: Routes = [
  {
    path: '', 
    component: IndexComponent,
    // canActivate: [AuthGuardService]
  },
  {
    path: 'auth', 
    component: AuthComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
