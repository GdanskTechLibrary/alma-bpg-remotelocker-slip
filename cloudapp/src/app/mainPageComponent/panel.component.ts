import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { CloudAppConfigService, CloudAppEventsService, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { initial_item } from '../commonStatics/item-config';
import { ConfigLoader } from '../commonComponents/configTreatment/configLoader';

@Component({
  selector: 'app-main',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  isAdmin = false;
  menu = [ ];
  loading = true;
  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService,
    private configService: CloudAppConfigService,
    private restService: CloudAppRestService
  ) { }

  ngOnInit() { 

    this.appService.setTitle('');
    let configuration = new ConfigLoader(this.restService, this.configService);
        configuration.getConfig()
            .subscribe((conf) =>{
                if (conf.items) {
                    for (let item of conf.items) {
                        this.menu = [...this.menu, 
                        {   
                            name: item.name,
                            comment:  item.comment,
                            circulation_desk: item.circulation_desk,
                            link: item.link,
                            icon: ''
                        }];
                    }
                }
                this.eventsService.getInitData().subscribe(data=>
                    {   
                        this.isAdmin = data.user.isAdmin;
                        if (data.user.isAdmin) {
                            this.menu = [...this.menu, initial_item];
                        }
                        this.loading = false;
                    })
              });
        }
}
