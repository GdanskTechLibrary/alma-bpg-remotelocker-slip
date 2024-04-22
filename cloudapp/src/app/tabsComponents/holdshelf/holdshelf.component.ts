import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../../app.service';
import { _get_requested_resources } from '../commonMethods/slips_from_api';
import { _send_slip_to_printer } from '../commonMethods/print_slip';

@Component({
  selector: 'app-holdshelf',
  templateUrl: './holdshelf.component.html',
  styleUrls: ['./holdshelf.component.scss']
})

export class HoldshelfComponent implements OnInit, OnDestroy {

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
        this.appService.setTitle('Holdshelf');
        this.get_requested_resources(); 
            
  }

  send_slip_to_printer() {
    _send_slip_to_printer();
  }
 
  get_requested_resources() {
        this.loading = true;
        _get_requested_resources(this.restService, 'holdShelf')
            .subscribe(result => {
                this.apiResult = result;
                this.loading = false;
            });
  }

  ngOnDestroy(): void {
  }
    isArray(obj : any ) {
       return Array.isArray(obj)
    }
}
