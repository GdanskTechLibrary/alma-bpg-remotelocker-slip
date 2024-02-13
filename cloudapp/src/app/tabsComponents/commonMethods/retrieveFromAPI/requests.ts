import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __passed_remotelocker } from '../../forRemotelocker';
import { __passed_holdshelf } from '../../forHoldshelf';
import { __passed_rental } from '../../forRental';

import { __select_books_descriptions } from '../submethods';

import { TComponentVariant } from '../types';

export function __retrieve_format_requests(user_primary_id : string, restService: CloudAppRestService, componentVariant: TComponentVariant)
{
    return restService.call<any>('/users/'+user_primary_id+'/requests').pipe(
                map(requests => {
                    if ((requests === null) || (requests.total_record_count === 0)) { 
                        return of(null);
                    }
                        console.log('ur cd',requests.user_request[0]?.pickup_location_circulation_desk);
                        console.log('ur tn',requests.user_request[0]?.task_name);
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
