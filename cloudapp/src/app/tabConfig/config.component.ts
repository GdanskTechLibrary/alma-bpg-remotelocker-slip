import { Component, OnInit, Injectable, Input, Output } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup } from '@angular/forms';
import { FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { CloudAppConfigService, CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib'; 
import { CloudAppRestService, InitData, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { ConfigLoader } from '../commonComponents/configTreatment/configLoader';
import { Observable, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { WrappedSortableComponent } from './wrapped-sortable/wrapped-sortable.component';

type TConfig = {
    idents_ordered: Array<any>,
    idents_checked: Array<boolean>
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})

export class ConfigComponent implements OnInit {
  form: FormGroup;
  form_value_var: any;
  saving = false;
  loading = false;
    config ?: TConfig;
  form_changed = false;
  button_all_check_caption = 'check all';

  constructor(
    private restService: CloudAppRestService,
    private appService: AppService,
    private configService: CloudAppConfigService,
    private alert: AlertService,
    private eventsService: CloudAppEventsService

  ) { }

  ngOnInit() {
//    this.configService.remove().subscribe( () => console.log('removed') );
    this.eventsService.getInitData().subscribe(data=>
        {   
        if (data.user.isAdmin) {
            this.loading = true;
            this.appService.setTitle('Config');
            let configuration = new ConfigLoader(this.restService, this.configService);
            configuration.getConfig().subscribe(conf => 
                {
                    this.form = FormGroupUtil.toFormGroup(conf);
                    this.config = conf;
                    this.loading = false;
                });
            }
        });
    };
  save() {
    new ConfigLoader(this.restService, this.configService).setConfig(this.form_value_var)
    .subscribe(() =>{
        this.saving = false;
        this.form_changed = false;
    });
  }
  form_change(form_changed: boolean) {
    this.form_changed = form_changed;
  }
  form_var_updated(form_var: Array<any>) {
    this.form_value_var = form_var;
  }
}

