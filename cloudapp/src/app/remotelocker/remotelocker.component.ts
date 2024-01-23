import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../app.service';
import { _get_requested_resources } from '../methods/fromApiToSlips';
import { _send_slip_to_printer } from '../methods/printSlip';

@Component({
  selector: 'app-remotelocker',
  templateUrl: './remotelocker.component.html',
  styleUrls: ['./remotelocker.component.scss']
})
export class RemotelockerComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult : any;
  users_observable: []; 

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private appService: AppService,
  ) { }

  ngOnInit() {
        this.appService.setTitle('Książkomat');
        this.loading = true;
        this.get_requested_resources() // 'remotelocker' | 'holdShelf'
            .subscribe(result => {
                this.apiResult = result as any[];
                this.loading = false;
            })
  }

  send_slip_to_printer() {
    _send_slip_to_printer();
  }
  get_requested_resources() {
    return _get_requested_resources(this.restService, 'remotelocker');
  }

  ngOnDestroy(): void {
  }

  private tryParseJson(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }
}
