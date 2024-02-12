import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../app.service';
import { _get_requested_resources } from '../methods/fromApiToSlips';
import { _send_slip_to_printer } from '../methods/printSlip';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss']
})

export class RentalComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any = 'default';
  users_observable: []; 

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService,
    private appService: AppService,
  ) { }

  ngOnInit() {
        this.appService.setTitle('Książki do wypożyczalni');
        this.loading = true;
        this.get_requested_resources()
            .subscribe(result => {
                this.apiResult = result;
                this.loading = false;
            })
  }

  send_slip_to_printer() {
    _send_slip_to_printer();
  }
 
  get_requested_resources() {
    return _get_requested_resources(this.restService, 'rental');
  }

  ngOnDestroy(): void {
  }
    isArray(obj : any ) {
       return Array.isArray(obj)
    }
}
