import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RemotelockerComponent } from './remotelocker/remotelocker.component';
import { HoldshelfComponent } from './holdshelf/holdshelf.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'remotelocker', component: RemotelockerComponent },
  { path: 'holdshelf', component: HoldshelfComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
