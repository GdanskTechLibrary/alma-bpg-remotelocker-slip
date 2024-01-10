import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../app.service';
import { _get_requested_resources } from '../methods/fromApiToSlips';

@Component({
  selector: 'app-holdshelf',
  templateUrl: './holdshelf.component.html',
  styleUrls: ['./holdshelf.component.scss']
})
export class HoldshelfComponent implements OnInit, OnDestroy {

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
        this.appService.setTitle('Książi na półce');
        this.loading = true;
        _get_requested_resources(this.restService, 'holdShelf') // 'remotelocker' | 'holdShelf'
            .subscribe(result => {
                this.apiResult = result;
                this.loading = false;
            })
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
