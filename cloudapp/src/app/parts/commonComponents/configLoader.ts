import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { CloudAppConfigService } from '@exlibris/exl-cloudapp-angular-lib'; 
import { Observable, of, forkJoin, throwError, EMPTY } from 'rxjs';
import { finalize, catchError, tap, map, flatMap, mergeMap, concatMap, debounceTime } from 'rxjs/operators';

type TConfig = {
    idents_ordered: Array<any>,
    idents_checked: Array<boolean>
}

export class ConfigLoader {
    conf: TConfig = {
        idents_ordered : [
        ],
        idents_checked : 
        [
            false, false, false, false, false, false, false, 
            false, false, false, false, false, false, false,
            false, false, false, false, false, false, false
        ]
    };
    config_from_memory ?:TConfig;
    
    constructor(
      private restService: CloudAppRestService,
      private configService: CloudAppConfigService,
      ) {}

    public getConfig(): Observable<TConfig> {
        
        return this.configService.get()
            .pipe(map(conf => {
                if (conf?.idents_ordered?.length === 0) {
                    this.restService.call<any>('/almaws/v1/conf/code-tables/UserIdentifierTypes')
                        .subscribe(result => {
                           this.conf.idents_ordered = this.add_indexes_to_array(result.row);
                           
            //                    this.conf.idents_ordered = result.row;
                        this.configService.set(this.conf).subscribe(
                            response => {console.log('rr',response);}
                        );
                    })
                    return this.conf;
                } else {
                    return conf;
                }
            }));

//.subscribe( conf => {
//            this.conf = conf; 
////
//            if (conf?.idents_ordered.length ===0) {
//                    this.restService.call<any>('/almaws/v1/conf/code-tables/UserIdentifierTypes').subscribe(result => {
////                        this.conf.idents_ordered = this.add_indexes_to_array(result.row);
//                        this.conf.idents_ordered = this.add_indexes_to_array(result.row);
//                        console.log('ttt',this.conf);
//                        this.configService.set(this.conf).subscribe(
//                            response => {console.log('rr',response);}
//                        );
//                    })
//
//            } else {
//                this.conf = this.config_from_memory;//
//            }
            
//        });
       
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

}