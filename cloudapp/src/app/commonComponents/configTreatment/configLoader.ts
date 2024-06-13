import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib'; 
import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap, debounceTime, switchMap } from 'rxjs/operators';
import { TConfig, TItem, TIdents } from '../../commonStatics/types';



export class ConfigLoader {
    
    conf: TConfig = {
            items: null, 
            is_default : true,
            circulation_desks: [],
            user_identifier_types: []
    };
    setting_uit = true;
    setting_lc = true;
    config_from_memory ?: TConfig;
    
    constructor(
      private restService: CloudAppRestService,
      private configService: CloudAppConfigService,
      ) {
      }
    public getConfig() {
        return this.configService.get()
            .pipe(map(conf => {
                return conf;
            }));
    }

    public retrieveFromAlmaToConfig() {
        this.configService.get().subscribe((conf) => {
            this.conf = conf;
                forkJoin(
                     this.restService.call<any>('/almaws/v1/conf/code-tables/UserIdentifierTypes'),
                     this.restService.call<any>('/almaws/v1/conf/libraries')
                 ).pipe(
                     mergeMap(([u_i_ts, libs]) => {
                         let user_identifier_types = [];
                         for (var item_id = 0; item_id < u_i_ts.row.length; item_id++) {
                             user_identifier_types[item_id] = this.add_indexes_to_array(u_i_ts.row); 
                         }
         ////////////////////////////////////////////////////////////////////////
                         this.conf.user_identifier_types = user_identifier_types;
                         let circ = [];
                         for (var lib_id = 0; lib_id < libs.library.length; lib_id++) {
                             circ.push(this.restService.call<any>(libs.library[lib_id].link+'/circ-desks'));
                             circ.push(of(libs.library[lib_id]));
                         }

                         return forkJoin(circ);
                     })
                     ).subscribe(circs => {//

                        this.conf.circulation_desks = this.reorganize_circ_libraries(circs);
                        if (!this.conf.items) {
                           this.conf.items = [];
                        }
                        this.configService.set(this.conf).subscribe();
                });
            });//
        
    }
    public setConfig(conf: TConfig): Observable<any> {
        return this.configService.set(conf)
    }
    add_indexes_to_array(idents_ordered) {
        var idents_ordered_indexed = [];
        var i = 0;
        for ( var ident_ordered of idents_ordered) {
            idents_ordered_indexed.push({'ident':ident_ordered, 'index':i});
            i++;
        }
        return idents_ordered_indexed;
    }
    reorganize_circ_libraries(circ_libraries: Array<any>) {
        var circ_array: Array<any> = [];
        for (var cl_id = 0 ; cl_id < circ_libraries.length/2; cl_id++) {
            for (var cd_id = 0 ; cd_id < circ_libraries[cl_id*2]['circ_desk'].length; cd_id++) {
                circ_array.push({ circ_desk_code : circ_libraries[cl_id*2]['circ_desk'][cd_id]['code'], circ_desk_name : circ_libraries[cl_id*2]['circ_desk'][cd_id]['name'], library_code : circ_libraries[cl_id*2+1]['code'], library_name : circ_libraries[cl_id*2+1]['name'] });
            }
        }
        return circ_array;
    }
    
}