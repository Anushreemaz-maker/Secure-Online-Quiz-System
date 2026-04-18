import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { CreateTestComponent } from './create-test/create-test';
import { AddQuestionComponent } from '../../admin/add-question/add-question'; // ← ADD

const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'create-test', component: CreateTestComponent },
  { path: 'add-question', component: AddQuestionComponent }  // ← ADD
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}