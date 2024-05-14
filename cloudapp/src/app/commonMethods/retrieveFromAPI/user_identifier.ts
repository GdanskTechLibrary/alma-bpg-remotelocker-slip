import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __choice_user_barcode } from './remotelockerMethods';

import { TBookRequest, isTBookRequest } from '../types';


export function __retrevie_replace_uid(request : TBookRequest, restService: CloudAppRestService, idents_ordered?: Array<any>, idents_checked?: Array<any>)
{
    return restService.call<any>('/users/'+request.user_identifier).pipe(
                            catchError((err, o) => of(null)),
                            map(user_datas => {
                                if (!user_datas) return of(null);
                                return {
                                        user_identifier: __choice_user_barcode(user_datas, idents_ordered, idents_checked)[0], 
                                        show_user_barcode: __choice_user_barcode(user_datas, idents_ordered, idents_checked)[1],
                                        identifier_type: __choice_user_barcode(user_datas, idents_ordered, idents_checked)[2],
                                        books_descriptions: request.books_descriptions
                                       }

                            }),
                        );
}