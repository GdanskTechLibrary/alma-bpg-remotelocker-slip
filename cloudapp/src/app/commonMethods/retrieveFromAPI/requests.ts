import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __passed_remotelocker } from './remotelockerMethods';

export function __retrieve_format_requests(user_primary_id : string, restService: CloudAppRestService)
{
    return restService.call<any>('/users/'+user_primary_id+'/requests?limit=100').pipe(
                map(requests => {
                    if ((requests === null) || (requests.total_record_count === 0)) { 
                        return of(null);
                    }
                    let books = __passed_remotelocker(requests.user_request);
                    let books_descriptions = __select_books_descriptions(books);
                    if (books_descriptions.length !== 0) {
                        return {
                                user_identifier: user_primary_id, 
                                books_descriptions: books_descriptions,
                               }    
                    } else {
                        return of(null);
                    }
                }),
                catchError((err, o) => of(null)),
                )
}
function __select_books_descriptions(user_requests: Array<any>): Array<string> {
    return user_requests
       .reduce((user_requests,book) => {
            user_requests.push({book_barcode: book.barcode, book_brief: book.title.substr(0,40) }); return user_requests;}, []);
  }
