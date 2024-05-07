import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './commonComponents/main/main.component';
import { RemotelockerComponent } from './tabsComponents/tabRemotelocker/remotelocker.component';
import { HoldshelfComponent } from './tabsComponents/tabHoldshelf/holdshelf.component';
import { LendingComponent } from './tabsComponents/tabLending/lending.component';
import { ConfigComponent } from './tabConfig/config.component';
import { adminGuard } from './commonComponents/configTreatment/adminGuard';

const routes: Routes = [
  { path: '', component: MainComponent },
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
