import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { StartTestComponent } from './components/start-test/start-test';
import { Result } from './components/result/result';

const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'start-test/:id', component: StartTestComponent },
  { path: 'result', component: Result }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}