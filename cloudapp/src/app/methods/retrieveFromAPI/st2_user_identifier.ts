import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __passed_remotelocker, __choice_user_barcode } from '../submethods/forRemotelocker';
import { __passed_holdshelf, __extract_user_name_description } from '../submethods/forHoldshelf';

import { TBookRequest, isTBookRequest } from '../types';

export function __retrevie_replace_uid(request : TBookRequest, restService: CloudAppRestService, componentVariant: 'remotelocker' | 'holdShelf')
{
    return restService.call<any>('/users/'+request.user_identifier).pipe(
                            catchError((err, o) => of(null)),
                            map(user_datas => {
                                if (!user_datas) return of(null);
                                console.log('ext',user_datas?.external_id);
                                if (componentVariant === 'remotelocker' && user_datas?.external_id === "48FAR_GUM") return of(null);
                                if (componentVariant === 'remotelocker' && user_datas?.external_id === "48FAR_UGD") return of(null);
                                return {
                                        user_identifier: (componentVariant === 'remotelocker')?__choice_user_barcode(user_datas)[0]:__extract_user_name_description(user_datas), 
                                        show_user_barcode: (componentVariant === 'remotelocker')?__choice_user_barcode(user_datas)[1]:false,
                                        books_descriptions: request.books_descriptions
                                       }

                            }),
                        );
}