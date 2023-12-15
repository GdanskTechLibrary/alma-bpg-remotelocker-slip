import { Observable  } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
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
  _fetch_item(url): Observable<any> {
    var item: any = null;
    this.loading = true;

    return this.restService.call<any>(url).pipe(finalize(()=>this.loading=false))
  }

  _get_requested_resources():void {
    let extracted_datas = [];
    let users_cd_remotelocker_requ = [];
    let unique_users_primary_id = [];
    this.loading = true;
    this._fetch_item('/almaws/v1/task-lists/printouts?letter=Transit Letter&limit=100')
    .subscribe(printouts => {
        let filtered = printouts.printout
        let choiced = filtered;
//                console.log('tyle printoutsów:',choiced);
        choiced.forEach((printout) => {
            var parser = new DOMParser();
            var printout_dom = parser.parseFromString(printout.letter,"text/html");
            let user_primary_id_span = printout_dom.getElementById('PrimaryID');
            if (user_primary_id_span?.innerHTML) {
                var user_primary_id = user_primary_id_span.innerHTML;
                if (!unique_users_primary_id.includes(user_primary_id)) {
                    unique_users_primary_id.push(user_primary_id);
                    this._fetch_item('/users/'+user_primary_id+'/requests')
                        .subscribe(requests => {
                                        console.log(requests);
                                let first_remotelocker_request = true;
                                requests.user_request
                                    .filter(ur => ur.pickup_location_circulation_desk =="cd_remotelocker-requ")
                                    .filter(ur => ur.task_name =="Transit Item")
                                    .forEach(request => {
                                            console.log(request); 
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
                            }),
                        (error => this.alert.error('Failed to retrieve entity: ' + error.message))

                }
            }
        });
        
        
                    this.apiResult = users_cd_remotelocker_requ;
        }),
        (error => this.alert.error('Failed to retrieve entity: ' + error.message))
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