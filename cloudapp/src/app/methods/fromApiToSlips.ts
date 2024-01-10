import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap, } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __only_remotelocker, __only_holdshelf, __choice_user_barcode, __extract_user_name_description } from './relatedToComponent';

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
       .reduce((user_requests,book) => {console.log('book', book);user_requests.push({book_barcode: book.barcode, book_brief: book.title.substr(0,40) }); return user_requests;}, []);
  }

export function _get_requested_resources(restService: CloudAppRestService, componentVariant: 'remotelocker' | 'holdShelf'): Observable<any> {
    let letter_param = '';
//    let 
    if (componentVariant === 'remotelocker') { letter_param = 'letter=Transit Letter&'; }

    return restService.call<any>('/almaws/v1/task-lists/printouts?'+letter_param+'limit=100')
        .pipe(
            catchError((err, o) => of(null)),
            map(printouts => __parse_unique_users_ids(printouts.printout)),
            mergeMap(users => {
                return forkJoin(users.map((user_primary_id) => {
                    return restService.call<any>('/users/'+user_primary_id+'/requests').pipe(
                        catchError((err, o) => of(null)),
                        map(requests => {
                            if ((requests === null) || (requests.total_record_count === 0)) { 
                                return of(null);
                            }
                            let books_descriptions = __select_books_descriptions((componentVariant === 'remotelocker')?__only_remotelocker(requests.user_request):__only_holdshelf(requests.user_request));
                            if (books_descriptions.length !== 0) {
                                return {
                                        user_identifier: user_primary_id, 
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
                    return restService.call<any>('/users/'+request.user_identifier).pipe(
                        catchError((err, o) => of(null)),
                        map(user_datas => {
                            if (!user_datas) return of(null);
                            if (componentVariant === 'remotelocker' && user_datas?.external_id !== "") return of(null);
                            return {
                                    user_identifier: (componentVariant === 'remotelocker')?__choice_user_barcode(user_datas):__extract_user_name_description(user_datas), 
                                    books_descriptions: request.books_descriptions
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