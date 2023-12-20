import { Observable, of } from 'rxjs';
import { finalize, tap, map, flatMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../app.service';

@Component({
  selector: 'app-holdshelf',
  templateUrl: './holdshelf.component.html',
  styleUrls: ['./holdshelf.component.scss']
})
export class HoldshelfComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any;

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private appService: AppService, 
  ) { }

  ngOnInit() {
        this.appService.setTitle('Książki na półce');
        this._get_requested_resources()
  }

  ngOnDestroy(): void {
  }
  _get_requested_resources():void {
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