import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap, debounceTime } from 'rxjs/operators';
import { CloudAppRestService, CloudAppEventsService, Request, HttpMethod, 
  Entity, RestErrorResponse, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

import { __parse_unique_uids_from_printouts} from './parse_uids';
import { __retrieve_format_requests } from './retrieveFromAPI/requests';
import { __retrevie_replace_uid } from './retrieveFromAPI/user_identifier';

import { isTBookRequest } from '../commonStatics/types';

export function _get_requested_resources(restService: CloudAppRestService, idents_ordered: Array<any>, idents_checked: Array<any>, circulation_desk: string, library: string, show_primary_id: boolean, show_barcode: boolean, show_fullname: boolean, bottom_fullname: boolean): Observable<any> 
{
    let letter_param = '';

    return restService.call<any>('/almaws/v1/task-lists/printouts?letter=Transit Letter&limit=100')
        .pipe(
            map(printouts => __parse_unique_uids_from_printouts(printouts.printout)),
            mergeMap(users => 
                forkJoin(users.map((user_primary_id) => 
                    __retrieve_format_requests(user_primary_id, restService, circulation_desk, library))
            )),
            map(users_cd_requ => users_cd_requ?.filter(notnull => notnull !== null)),
            mergeMap(user_requests => forkJoin(user_requests.map((request) => {
                    if (request === null) return of(null);
                    if ((request instanceof Observable)) return of(null);
                    if (isTBookRequest(request)) {
                        return __retrevie_replace_uid(request, restService, idents_ordered, idents_checked, show_primary_id, show_barcode, show_fullname, bottom_fullname);
                    }
                })
            )),
            map(users_cd_requ => users_cd_requ?.filter(notnull => notnull !== null)),
            map(users_cd_requ => users_cd_requ?.filter(notObservable => !(notObservable instanceof Observable))),
            catchError((err, o) => of("prosimy o kontakt z administratorem")),
        );
}