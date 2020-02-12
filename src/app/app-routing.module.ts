import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsoleComponent } from './console/console.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  { path: 'console', component: ConsoleComponent},
  { path: 'result', component: ResultComponent},
  { path: '', redirectTo: "console", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
