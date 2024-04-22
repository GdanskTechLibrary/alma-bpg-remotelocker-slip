import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, AlertModule, MenuModule, CloudAppTranslateModule } from '@exlibris/exl-cloudapp-angular-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectEntitiesModule } from 'eca-components';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './parts/main/main.component';
import { TopmenuComponent } from './parts/topmenu/topmenu.component';
import { RemotelockerComponent } from './tabsComponents/tabRemotelocker/remotelocker.component';
import { HoldshelfComponent } from './tabsComponents/tabHoldshelf/holdshelf.component';
import { LendingComponent } from './tabsComponents/tabLending/lending.component';
import { NgxBarcodeModule } from '@joshmweisman/ngx-barcode';
import { NgxSortableModule } from 'ngx-sortable'
//import { NewrouteComponent } from './newroute/newroute.component';
//import { ThemingComponent } from './theming/theming.component';
import { SettingsComponent } from './tabSettings/settings.component';
//import { ParallelComponent } from './parallel/parallel.component';
//import { ExternalComponent } from './external/external.component';
//import { XmlComponent } from './xml/xml.component';
//import { BindComponent } from './bind/bind.component';
//import { StoreComponent } from './store/store.component';
//import { TranslateComponent } from './translate/translate.component';
//import { ConfigurationComponent } from './configuration/configuration.component';
//import { MultiSelectComponent } from './multi-select/multi-select.component';
//import { LightboxComponent } from './external/lightbox/lightbox.component'
//import { ErrorComponent } from './static/error.component';
//import { ConfirmationDialog, StyleComponent } from './style/style.component';

@NgModule({
   declarations: [	
      AppComponent,
      MainComponent,
      TopmenuComponent,
      RemotelockerComponent,
      HoldshelfComponent,
      SettingsComponent,
      LendingComponent,
   ],
   imports: [
      MaterialModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      CloudAppTranslateModule.forRoot(),
      AlertModule,
      SelectEntitiesModule,
      MenuModule,
      NgxBarcodeModule,
      NgxSortableModule
   ],
   providers: [
      Title
   ],
   bootstrap: [
      AppComponent
   ],
   entryComponents: [
//      ConfirmationDialog
   ]
})
export class AppModule { }
