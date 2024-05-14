import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppConfigService, CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../../app.service';
import { _get_requested_resources } from '../commonMethods/slips_from_api';
import { _send_slip_to_printer } from '../commonMethods/print_slip';
import { ConfigLoader } from '../../commonComponents/configTreatment/configLoader';
import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap, debounceTime } from 'rxjs/operators';

type TConfig = {
    idents_ordered: Array<any>,
    idents_checked: Array<boolean>
}

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
    private configService: CloudAppConfigService,
    private alert: AlertService,
    private appService: AppService,
  ) { }

  ngOnInit() {
        this.appService.setTitle('Remotelocker');
        this.get_requested_resources();
  }

  send_slip_to_printer() {
    _send_slip_to_printer();
  }

  get_requested_resources() {
        this.loading = true;
        let configuration = new ConfigLoader(this.restService, this.configService);
        configuration.getConfig()
            .pipe(mergeMap((conf: TConfig) => {
                return _get_requested_resources(this.restService, 'remotelocker', conf.idents_ordered, conf.idents_checked)
           })).subscribe((result) =>{
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
