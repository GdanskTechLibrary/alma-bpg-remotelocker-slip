import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RemotelockerComponent } from './tabsComponents/remotelocker/remotelocker.component';
import { HoldshelfComponent } from './tabsComponents/holdshelf/holdshelf.component';
import { RentalComponent } from './tabsComponents/rental/rental.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'remotelocker', component: RemotelockerComponent },
  { path: 'holdshelf', component: HoldshelfComponent },
  { path: 'rental', component: RentalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
