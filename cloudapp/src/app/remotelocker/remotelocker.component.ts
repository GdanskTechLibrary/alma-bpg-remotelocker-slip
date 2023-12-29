import { Observable, of, forkJoin } from 'rxjs';
import { finalize, tap, map, flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { MatRadioChange } from '@angular/material/radio';
import { AppService } from '../app.service';

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
        this._get_requested_resources();
  }

  ngOnDestroy(): void {
  }
  ___parse_user_id(letter : string, unique_users_ids: Array<string>): string | void {
    var parser = new DOMParser();
    let user_primary_id_span_html = parser.parseFromString(letter,"text/html")
                                        .getElementById('PrimaryID')?.innerHTML;
    if (user_primary_id_span_html) {
            return user_primary_id_span_html;
    }
  }
  __parse_unique_users_ids(printouts: Array<any>): Array<string> {
    let unique_users_ids = [];
    printouts.forEach((printout) => {
        let user_id = this.___parse_user_id(printout.letter, unique_users_ids)
        if (user_id) {
            unique_users_ids.push(user_id)
        }
    });
    return unique_users_ids.filter((value, index, array) => array.indexOf(value) === index);
  }
  __select_books_descriptions(user_requests: Array<any>): Array<string> {
    
    return user_requests
        .filter(ur => ur.pickup_location_circulation_desk === "cd_remotelocker-requ")
        .filter(ur => ur.task_name === "Transit Item")
        .reduce((user_requests,book) => {console.log('book', book);user_requests.push({book_barcode: book.barcode, book_brief: book.title.substr(0,40) }); return user_requests;}, []);
  }
  __choice_user_barcode(user_datas:any): string 
  {
    console.log(user_datas);
    let add_id_1 = user_datas.user_identifier.filter(ui => ui.id_type.value === 'OTHER_ID_1')[0]?.value;
    let add_id_2 = user_datas.user_identifier.filter(ui => ui.id_type.value === 'OTHER_ID_2')[0]?.value;
    if (add_id_2) {
        if (user_datas.note_type.filter(nt => nt.note_text.value === "BARCODE").length !== 0
            && user_datas.note_type.filter(nt => nt.note_text === "mLegitymacja").length !== 0) {
                return add_id_2;
        }
    } else {
        if (add_id_1) {
            return add_id_1;
        }
    }
    // brak identyfikatora dla książkomatu
    if (user_datas.user_identifier.filter(ui => ui.id_type.value === 'BARCODE').length === 0) {
        return 'brak identyfikatora dla książkomatu';
    }
    return user_datas.user_identifier.filter(ui => ui.id_type.value === 'BARCODE')[0].value;
  }
  _get_requested_resources():void {
    this.restService.call<any>('/almaws/v1/task-lists/printouts?letter=Transit Letter&limit=100')
        .pipe(
            map(printouts => this.__parse_unique_users_ids(printouts.printout)),
            mergeMap(users => {
                return forkJoin(users.map((user_primary_id) => {
                    return this.restService.call<any>('/users/'+user_primary_id+'/requests').pipe(
                        map(requests => {
                            let books_descriptions = this.__select_books_descriptions(requests.user_request);
                            if (books_descriptions.length !== 0) {
                                return {
                                        user_barcode: user_primary_id, 
                                        books_descriptions: books_descriptions,
                                       }
                            } else {
                                return null;
                            }
                        }),
                        )
                    })
                );
            }),
            mergeMap(user_requests => {
                return forkJoin(user_requests.map((request) => {
                    if (!request) return of(null);
                    return this.restService.call<any>('/users/'+request.user_barcode).pipe(
                        map(user_datas => {
                            
                            if (user_datas && user_datas?.external_id === "") {
                                return {
                                        user_barcode: this.__choice_user_barcode(user_datas), 
                                        books_descriptions: request.books_descriptions
                                       }
                            } else {
                                return null;
                            }
                        }),
                    );
                })
            );}),
            map(users_cd_requ => users_cd_requ.filter(notnull => notnull !== null)),
        ).subscribe(result => {
            this.apiResult = result;
            console.log(this.apiResult);
        });
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
