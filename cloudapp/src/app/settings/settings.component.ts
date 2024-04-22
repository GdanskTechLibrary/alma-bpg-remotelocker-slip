import { Component, OnInit, Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup } from '@angular/forms';
import { CloudAppSettingsService, FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { CloudAppConfigService, CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib'; 
import { CloudAppRestService, InitData, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { Settings } from '../models/settings';
import { CanActivate, Router } from '@angular/router';
import { Observable, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
//import { ErrorMessages } from '../static/error.component';

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
 //   this.settingsService.remove().subscribe( () => console.log('removed') );
    this.loading = true;
    this.appService.setTitle('Settings');
    this.settingsService.get().subscribe( settings => {
        this.form = FormGroupUtil.toFormGroup(Object.assign(new Settings(), settings))
        this.form_value_var = this.form.value;
        this.idents_ordered = Object.assign(new Settings(), settings).idents_ordered;

//        this.idents_ordered = this.add_indexes_to_array(this.idents_ordered);
        this.idents_checked = Object.assign(new Settings(), settings).idents_checked;
  //console.log(this.idents_checked);
        this.loading = false;
        var form_value = this.form?.value;
        
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
  retrieve_values_without_indexes(idents_ordered) {
      var idents_ordered_without_indexes = [];
      for ( var ident_ordered of idents_ordered) {
          idents_ordered_without_indexes.push(ident_ordered.ident_ordered);
      }
      return idents_ordered_without_indexes;
  }
  reload_api() {
    this.saving = true;
    this.restService.call<any>('/almaws/v1/conf/code-tables/UserIdentifierTypes').subscribe(result => {
        this.idents_ordered = this.add_indexes_to_array(result.row);
        this.loading = false;
        this.saving = false;
        this.form_changed = true;
    })
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
  default_values() {
    this.settingsService.remove().subscribe( () => console.log('removed') );
    this.settingsService.get().subscribe( settings => {
        this.form = FormGroupUtil.toFormGroup(Object.assign(new Settings(), settings))
        this.form_value_var = this.form.value;
        this.idents_ordered = Object.assign(new Settings(), settings).idents_ordered;

//        this.idents_ordered = this.add_indexes_to_array(this.idents_ordered);
        this.idents_checked = Object.assign(new Settings(), settings).idents_checked;
  //console.log(this.idents_checked);
        this.loading = false;
        this.form_changed = true;
    });
  }
  check_all () {//
    let isAllChecked = !this.check_all_checked();
    var form_value = this.form?.value;
//    console.log(this.form?.get('idents_checked'));
    form_value.idents_checked.forEach((ident, i) => {
        form_value.idents_checked[i] = isAllChecked;
//        this.form?.get('idents_checked')['controls'].at(i)?.setValue(true);
        const checkbox = document.getElementsByName('ident_ordered_'+i)[0] as HTMLInputElement;
        if (checkbox) {
            checkbox.checked  = isAllChecked;
        }
    });
    this.form_value_var = form_value;
    this.form_changed = true;
    this.button_all_check_caption = 'uncheck all';
    isAllChecked = this.check_all_checked();
  }
  checking(value_of_index) {
    this.form_changed = true;
    var form_value = this.form?.value;
    form_value.idents_checked[value_of_index] = !form_value.idents_checked[value_of_index];
    this.form_value_var = form_value;
    this.form_changed = true;
  }
  listOrderChanged($event) {
    var form_value = this.form?.value;
    form_value.idents_ordered = $event;
    this.form_value_var = form_value;
    this.form_changed = true;
  }
  check_all_checked() {
    let checked_all = true;
    var form_value = this.form?.value;
    form_value.idents_checked.forEach((ident, i) => {
        if (!ident) {
            checked_all = false;
        };
    });//
    if (checked_all) {
        this.button_all_check_caption = 'uncheck all';
    } else {
        this.button_all_check_caption = 'check all';
    }
    return checked_all;
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
          this.router.navigate(['/error'], 
            { queryParams: { error: "Brak uprawnień" }});
          return false;
        }
        return true;
      })
    );
  }
}