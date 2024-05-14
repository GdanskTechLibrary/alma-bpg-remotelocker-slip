import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from './commonComponents/panel/panel.component';
import { ItemTemplateComponent } from './itemComponents/Template/item-template.component'
import { ConfigComponent } from './itemComponents/Config/config.component';

const routes: Routes = [
  { path: '', component: PanelComponent },
  { path: 'remotelocker', component: ItemTemplateComponent },
  { path: 'config', component: ConfigComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
