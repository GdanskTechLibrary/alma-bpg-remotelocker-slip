import { Component, OnInit, Injectable, Input, Output } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup } from '@angular/forms';
import { CloudAppSettingsService, FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { CloudAppConfigService, CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib'; 
import { CloudAppRestService, InitData, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { Settings } from '../parts/models/settings';
import { CanActivate, Router } from '@angular/router';
import { Observable, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { WrappedSortableComponent } from './wrapped-sortable/wrapped-sortable.component';
//import { ErrorMessages } from '../static/error.component';
//
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})


export class SettingsComponent implements OnInit {
  form: FormGroup;
  form_value_var: any;
  saving = false;
  loading = false;
  idents_ordered = [];
  form_changed = false;
  idents_checked = [];
  button_all_check_caption = 'check all';

  constructor(
    private restService: CloudAppRestService,
    private appService: AppService,
    private settingsService: CloudAppSettingsService,
    private alert: AlertService,
  ) { }

  ngOnInit() {
//    this.settingsService.remove().subscribe( () => console.log('removed') );
    this.loading = true;
    this.appService.setTitle('Settings');
    this.settingsService.get().subscribe( settings => {
        this.form = FormGroupUtil.toFormGroup(Object.assign(new Settings(), settings))
        this.form_value_var = this.form.value;
        this.idents_ordered = Object.assign(new Settings(), settings).idents_ordered;
        this.idents_checked = Object.assign(new Settings(), settings).idents_checked;
        this.loading = false;
        var form_value = this.form?.value;
        if (this.idents_ordered.length ===0) {
            this.restService.call<any>('/almaws/v1/conf/code-tables/UserIdentifierTypes').subscribe(result => {
                this.idents_ordered = this.add_indexes_to_array(result.row);
                this.loading = false;
            })
        }
    });

  }
  add_indexes_to_array(idents_ordered) {
      var idents_ordered_indexed = [];
      var i = 0;
      for ( var ident_ordered of idents_ordered) {
          idents_ordered_indexed.push({'ident_ordered':ident_ordered, 'index':i});
          i++;
      }
      return idents_ordered_indexed;
  }
  save() {
    this.saving = true;
    this.saving_settings(this.form_value_var);
  }
  saving_settings(values) {
    this.settingsService.set(values).subscribe(
      response => {
        this.alert.success('Settings successfully saved.');
        this.form.markAsPristine();
        this.form_changed = false;
      },
      err => this.alert.error(err.message),
      ()  => this.saving = false
    );
  }
  form_change(form_changed: boolean) {
    this.form_changed = form_changed;
  }
  form_var_updated(form_var: Array<any>) {
    this.form_value_var = form_var;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationGuard implements CanActivate {
  constructor (
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.eventsService.getInitData().pipe(
      switchMap( initData => this.restService.call(`/users/${initData.user.primaryId}`)),
      map( user => {
        if (!user.user_role.some(role=>role.role_type.value=='221')) {
          this.router.navigate(['/'], 
            { queryParams: { error: "Brak uprawnień" }});
          return false;
        }
        return true;
      })
    );
  }
}