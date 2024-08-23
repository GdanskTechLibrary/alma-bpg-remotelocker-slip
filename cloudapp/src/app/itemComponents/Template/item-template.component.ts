import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppConfigService, CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../../app.service';
import { _get_requested_resources } from '../../commonMethods/slips_from_api';
import { _send_slip_to_printer } from '../../commonMethods/print_slip';
import { ConfigLoader } from '../../commonComponents/configTreatment/configLoader';
import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap, debounceTime } from 'rxjs/operators';
import { TConfig } from '../../commonStatics/types';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-template',
  templateUrl: './item-template.component.html',
  styleUrls: ['./item-template.component.scss']
})

export class ItemTemplateComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any = [];
  idents_ordered : Array<any> = [];
  idents_checked : Array<any> = [];
  users_observable: []; 

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private configService: CloudAppConfigService,
    private alert: AlertService,
    private appService: AppService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
//        console.log('ttsdfg',);
        this.get_requested_resources();
  }

  send_slip_to_printer() {
    _send_slip_to_printer();
  }

  get_requested_resources() {
        let path_link = this.route.snapshot['_routerState'].url;
        this.loading = true;
        let configuration = new ConfigLoader(this.restService, this.configService);
        configuration.getConfig()
            .pipe(mergeMap((conf: TConfig) => {
                let items = conf.items;
                
                let item = items.filter((item) => item.link === path_link)[0];
                this.appService.setTitle(item.name);
                return _get_requested_resources(this.restService, item.idents.order, item.idents.check, item.circulation_desk, item.library_code, item.show_primary_id, item.show_barcode, item.show_fullname, item.bottom_fullname, item.group_items_by_user)
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
