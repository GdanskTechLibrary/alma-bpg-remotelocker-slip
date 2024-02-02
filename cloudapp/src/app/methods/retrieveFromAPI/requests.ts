import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __passed_remotelocker } from '../submethods/forRemotelocker';
import { __passed_holdshelf } from '../submethods/forHoldshelf';
import { __passed_rental } from '../submethods/forRental';

import { __select_books_descriptions } from '../submethods/common';

import { TComponentVariant } from '../types';

export function __retrieve_format_requests(user_primary_id : string, restService: CloudAppRestService, componentVariant: TComponentVariant)
{
    return restService.call<any>('/users/'+user_primary_id+'/requests').pipe(
                map(requests => {
                    if ((requests === null) || (requests.total_record_count === 0)) { 
                        return of(null);
                    }
                    let books = (componentVariant === 'remotelocker')?__passed_remotelocker(requests.user_request):
                            (componentVariant === 'holdShelf')?__passed_holdshelf(requests.user_request): __passed_rental(requests.user_request);
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
