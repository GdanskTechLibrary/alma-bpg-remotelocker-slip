import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './parts/main/main.component';
import { RemotelockerComponent } from './tabsComponents/tabRemotelocker/remotelocker.component';
import { HoldshelfComponent } from './tabsComponents/tabHoldshelf/holdshelf.component';
import { LendingComponent } from './tabsComponents/tabLending/lending.component';
import { SettingsComponent } from './tabSettings/settings.component';

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
