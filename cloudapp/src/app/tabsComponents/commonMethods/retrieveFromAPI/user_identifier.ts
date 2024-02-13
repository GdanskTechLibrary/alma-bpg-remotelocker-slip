import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __choice_user_barcode } from '../../remotelockerMethods';
import { __extract_user_name_description } from '../../holdshelfMethods';

import { TBookRequest, isTBookRequest, TComponentVariant } from '../types';

export function __retrevie_replace_uid(request : TBookRequest, restService: CloudAppRestService, componentVariant: TComponentVariant)
{
    return restService.call<any>('/users/'+request.user_identifier).pipe(
                            catchError((err, o) => of(null)),
                            map(user_datas => {
                                if (!user_datas) return of(null);
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