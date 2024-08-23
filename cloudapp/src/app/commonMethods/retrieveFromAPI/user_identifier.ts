import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __choice_user_barcode } from './filters';
//
import { TBookRequest, isTBookRequest } from '../../commonStatics/types';


export function __retrevie_replace_uid(request : TBookRequest, restService: CloudAppRestService, idents_ordered: Array<any>, idents_checked: Array<any>, show_primary_id: boolean, show_barcode: boolean, show_fullname: boolean, bottom_fullname: boolean, group_items_by_user: boolean)
{
    return restService.call<any>('/users/'+request.user_identifier).pipe(
                            catchError((err, o) => of(null)),
                            map(user_datas => {
                                if (!user_datas) return of(null);
                                return {
                                        user_identifier: __choice_user_barcode(user_datas, idents_ordered, idents_checked, show_primary_id, show_barcode, show_fullname)[0], 
                                        show_user_barcode: __choice_user_barcode(user_datas, idents_ordered, idents_checked, show_primary_id, show_barcode, show_fullname)[1],
                                        identifier_type: __choice_user_barcode(user_datas, idents_ordered, idents_checked, show_primary_id, show_barcode, show_fullname)[2],
                                        fullname: user_datas.full_name,
                                        show_fullname: show_fullname,
                                        bottom_fullname: bottom_fullname,
                                        group_items_by_user: group_items_by_user,
                                        show_barcode: show_barcode,
                                        books_descriptions: request.books_descriptions
                                       }

                            }),
                        );
}