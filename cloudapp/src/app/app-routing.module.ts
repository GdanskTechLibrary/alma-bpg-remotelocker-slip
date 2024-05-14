import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from './commonComponents/panel/panel.component';
import { RemotelockerComponent } from './itemComponents/tabRemotelocker/remotelocker.component';
import { HoldshelfComponent } from './itemComponents/tabHoldshelf/holdshelf.component';
import { LendingComponent } from './itemComponents/tabLending/lending.component';
import { ConfigComponent } from './itemComponents/Config/config.component';

const routes: Routes = [
  { path: '', component: PanelComponent },
  { path: 'remotelocker', component: RemotelockerComponent },
  { path: 'holdshelf', component: HoldshelfComponent },
  { path: 'lending', component: LendingComponent },
  { path: 'config', component: ConfigComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
