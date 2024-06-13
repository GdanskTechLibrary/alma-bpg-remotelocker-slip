import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { PanelComponent } from './mainPageComponent/panel.component';
import { ItemTemplateComponent } from './itemComponents/Template/item-template.component'
import { ConfigComponent } from './itemComponents/Config/config.component';
import { CloudAppConfigService, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { ConfigLoader } from './commonComponents/configTreatment/configLoader';

let routes: Routes = [{ path: '', component: PanelComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  private isAdmin: boolean = false;
  constructor
    (
        router: Router,
        private configService: CloudAppConfigService,
        private restService: CloudAppRestService
    ) {
                routes = [...routes, {path: 'item/:id', component: ItemTemplateComponent }];
                routes = [...routes, {path: 'config', component: ConfigComponent}];
                router.resetConfig(routes);
      }
}
