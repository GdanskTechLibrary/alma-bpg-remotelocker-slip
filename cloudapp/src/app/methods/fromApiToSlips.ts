import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap, } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

function ___parse_user_id(letter : string, unique_users_ids: Array<string>): string | void {
    var parser = new DOMParser();
    let user_primary_id_span_html = parser.parseFromString(letter,"text/html")
                                        .getElementById('PrimaryID')?.innerHTML;
    if (user_primary_id_span_html) {
            return user_primary_id_span_html;
    }
  }
function __parse_unique_users_ids(printouts: Array<any>): Array<string> {
    let unique_users_ids = [];
    printouts.forEach((printout) => {
        let user_id = ___parse_user_id(printout.letter, unique_users_ids)
        if (user_id) {
            unique_users_ids.push(user_id)
        }
    });
    return unique_users_ids.filter((value, index, array) => array.indexOf(value) === index);
  }
function __select_books_descriptions(user_requests: Array<any>): Array<string> {
    
    return user_requests
        .filter(ur => ur.pickup_location_circulation_desk === "cd_remotelocker-requ")
        .filter(ur => ur.task_name === "Transit Item")
        .reduce((user_requests,book) => {console.log('book', book);user_requests.push({book_barcode: book.barcode, book_brief: book.title.substr(0,40) }); return user_requests;}, []);
  }
function __choice_user_barcode(user_datas:any): string 
  {
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
export function _get_requested_resources(restService: CloudAppRestService): Observable<any> {
    return restService.call<any>('/almaws/v1/task-lists/printouts?letter=Transit Letter&limit=100')
        .pipe(
            map(printouts => __parse_unique_users_ids(printouts.printout)),
            mergeMap(users => {
                return forkJoin(users.map((user_primary_id) => {
                    return restService.call<any>('/users/'+user_primary_id+'/requests').pipe(
                        catchError((err, o) => of(null)),
                        map(requests => {
                            if (requests === null) { 
                                return of(null);
                            }
                            let books_descriptions = __select_books_descriptions(requests.user_request);
                            if (books_descriptions.length !== 0) {
                                return {
                                        user_barcode: user_primary_id, 
                                        books_descriptions: books_descriptions,
                                       }    
                            } else {
                                return of(null);
                            }
                        }),
                        )
                    })
                );
            }),
            map(users_cd_requ => users_cd_requ.filter(notnull => notnull !== null)),
            mergeMap(user_requests => {
                if ((user_requests instanceof Observable)) return of(null);
                return forkJoin(user_requests.map((request) => {
                    if (request === null) return of(null);
                    
                    if ((request instanceof Observable)) return of(null);
                    return restService.call<any>('/users/'+request.user_barcode).pipe(
                        map(user_datas => {
                            
                            if (user_datas && user_datas?.external_id === "") {
                                return {
                                        user_barcode: __choice_user_barcode(user_datas), 
                                        books_descriptions: request.books_descriptions
                                       }
                            } else {
                                return of(null);
                            }

                        }),
                    );
                })
            );
            }),
            map(users_cd_requ => users_cd_requ.filter(notnull => notnull !== null)),
            map(users_cd_requ => users_cd_requ.filter(notObservable => !(notObservable instanceof Observable))),
        );
  }