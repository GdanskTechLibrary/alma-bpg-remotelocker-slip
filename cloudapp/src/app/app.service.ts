import { Injectable } from '@angular/core';
import { InitService } from '@exlibris/exl-cloudapp-angular-lib';
import { BehaviorSubject, Observable } from 'rxjs';
import { CloudAppConfigService, CloudAppEventsService, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { ConfigLoader } from './commonComponents/configTreatment/configLoader';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private title = new BehaviorSubject<String>('App title');
    private title$ = this.title.asObservable();
    
    constructor(
        private initService: InitService,
        private configService: CloudAppConfigService,
        private restService: CloudAppRestService,
) {
    let configuration = new ConfigLoader(this.restService, this.configService);
        configuration.retrieveFromAlmaToConfig();
    }

    setTitle(title: String) {
        this.title.next(title);
    }
    
    getTitle(): Observable<String> {
        return this.title$;
    }
}