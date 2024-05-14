import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';
import { menu } from './item-template';
import { menu_only_admin } from './item-config';

@Component({
  selector: 'app-main',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  isAdmin = false;
  menu = menu;

  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService
  ) { }

  ngOnInit() { 
    this.appService.setTitle('');
    this.eventsService.getInitData().subscribe(data=>
        {   
            this.isAdmin = data.user.isAdmin;
            if (data.user.isAdmin) {
                this.menu = menu_only_admin
            }
        })
  }

}
