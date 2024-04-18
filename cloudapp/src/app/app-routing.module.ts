import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RemotelockerComponent } from './tabsComponents/remotelocker/remotelocker.component';
import { HoldshelfComponent } from './tabsComponents/holdshelf/holdshelf.component';
import { LendingComponent } from './tabsComponents/lending/lending.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'remotelocker', component: RemotelockerComponent },
  { path: 'holdshelf', component: HoldshelfComponent },
  { path: 'lending', component: LendingComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
