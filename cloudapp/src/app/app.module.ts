import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, AlertModule, MenuModule, CloudAppTranslateModule } from '@exlibris/exl-cloudapp-angular-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectEntitiesModule } from 'eca-components';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { TopmenuComponent } from './topmenu/topmenu.component';
import { RemotelockerComponent } from './remotelocker/remotelocker.component';
import { HoldshelfComponent } from './holdshelf/holdshelf.component';
import { RentalComponent } from './rental/rental.component';
import { NgxBarcodeModule } from '@joshmweisman/ngx-barcode';
//import { NewrouteComponent } from './newroute/newroute.component';
//import { ThemingComponent } from './theming/theming.component';
//import { SettingsComponent } from './settings/settings.component';
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
      RentalComponent,
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
