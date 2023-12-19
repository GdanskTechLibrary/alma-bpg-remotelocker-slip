import { Observable, of } from 'rxjs';
import { finalize, tap, map, flatMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity;
  apiResult: any;
  
              

  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private alert: AlertService 
  ) { }

  ngOnInit() {
        this._get_requested_resources()
  }

  ngOnDestroy(): void {
  }

  _get_requested_resources():void {
    let extracted_datas = [];
    let unique_users_primary_id = [];
    this.restService.call<any>('/almaws/v1/task-lists/printouts?letter=Transit Letter&limit=100')
        .pipe(
        map(printouts => printouts.printout),
        map(printouts => {
            printouts.forEach((printout) => {
                var parser = new DOMParser();
                var printout_dom = parser.parseFromString(printout.letter,"text/html");
                let user_primary_id_span = printout_dom.getElementById('PrimaryID');
                if (user_primary_id_span?.innerHTML) {
                    var user_primary_id = user_primary_id_span.innerHTML;
                    if (!unique_users_primary_id.includes(user_primary_id)) {
                        unique_users_primary_id.push(user_primary_id);
                    }
                }
            });
            return unique_users_primary_id;
        }),
       map(users => {
            let users_cd_remotelocker_requ = [];
            users.forEach((user_primary_id) => {
                this.restService.call<any>('/users/'+user_primary_id+'/requests')
                    .subscribe(requests => {
                        let first_remotelocker_request = true;
                        requests.user_request
                            .filter(ur => ur.pickup_location_circulation_desk =="cd_remotelocker-requ")
                            .filter(ur => ur.task_name =="Transit Item")
                            .forEach(request => {
                                if (first_remotelocker_request) {
                                    users_cd_remotelocker_requ.push({'user_barcode': user_primary_id, 'book_barcode': []});
                                    first_remotelocker_request = false;
                                } 
                                for ( var index=0; index<users_cd_remotelocker_requ.length; index++ ) {
                                    if (users_cd_remotelocker_requ[index]['user_barcode'] === user_primary_id) {
                                        users_cd_remotelocker_requ[index]['book_barcode'].push(request.barcode)
                                    }
                                }
                            });
                    })
                })
                this.apiResult =  users_cd_remotelocker_requ;
            })
        ).subscribe();
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