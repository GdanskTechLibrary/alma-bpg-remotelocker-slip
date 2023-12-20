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
  ___parse_user_id(letter : string, unique_users_ids: Array<string>): string | void {
    var parser = new DOMParser();
    let user_primary_id_span_html = parser.parseFromString(letter,"text/html")
                                        .getElementById('PrimaryID')?.innerHTML;
    if (user_primary_id_span_html) {
            return user_primary_id_span_html;
    }
  }
  __parse_unique_users_ids(printouts: Array<any>): Array<number> {
    let unique_users_ids = [];
    printouts.forEach((printout) => {
        let user_id = this.___parse_user_id(printout.letter, unique_users_ids)
        if (user_id) {
            unique_users_ids.push(user_id)
        }
    });
    return unique_users_ids.filter((value, index, array) => array.indexOf(value) === index);
  }
  __fetch_books_barcodes(user_requests: Array<any>): Array<string> {
    return user_requests
        .filter(ur => ur.pickup_location_circulation_desk === "cd_remotelocker-requ")
        .filter(ur => ur.task_name === "Transit Item")
        .reduce((user_requests,book) => {user_requests.push(book.barcode); return user_requests;}, []);
  }
  _get_requested_resources():void {
    let extracted_datas = [];
    this.restService.call<any>('/almaws/v1/task-lists/printouts?letter=Transit Letter&limit=100')
        .pipe(
            map(printouts => this.__parse_unique_users_ids(printouts.printout)),
            map(users => {
                let users_cd_remotelocker_requ = [];
                users.forEach((user_primary_id) => {
                    this.restService.call<any>('/users/'+user_primary_id+'/requests')
                        .subscribe(requests => {
                            let books_barcodes = this.__fetch_books_barcodes(requests.user_request);
                            if (books_barcodes.length !== 0) {
                                users_cd_remotelocker_requ.push({'user_barcode': user_primary_id, 'book_barcode': books_barcodes})
                            }
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