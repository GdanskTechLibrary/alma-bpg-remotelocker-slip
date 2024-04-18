import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppSettingsService, CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../../app.service';
import { _get_requested_resources } from '../commonMethods/slips_from_api';
import { _send_slip_to_printer } from '../commonMethods/print_slip';
import { Settings } from '../../models/settings';

@Component({
  selector: 'app-remotelocker',
  templateUrl: './remotelocker.component.html',
  styleUrls: ['./remotelocker.component.scss']
})

export class RemotelockerComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any = 'default';
  idents_ordered : Array<any> = [];
  idents_checked : Array<any> = [];
  users_observable: []; 

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private settingsService: CloudAppSettingsService,
    private alert: AlertService,
    private appService: AppService,
  ) { }

  ngOnInit() {
        this.appService.setTitle('Książkomat');
        this.get_requested_resources();
  }

  send_slip_to_printer() {
    _send_slip_to_printer();
  }

  get_requested_resources() {
        this.loading = true;
        this.settingsService.get().subscribe( settings => {
          this.idents_ordered = Object.assign(new Settings(), settings).idents_ordered;
          this.idents_checked = Object.assign(new Settings(), settings).idents_checked;
          _get_requested_resources(this.restService, 'remotelocker', this.idents_ordered, this.idents_checked)
                .subscribe(result => {
                    this.apiResult = result;
                    this.loading = false;
                })
        });
    
  }

  ngOnDestroy(): void {
  }
    isArray(obj : any ) {
       return Array.isArray(obj)
    }
}
