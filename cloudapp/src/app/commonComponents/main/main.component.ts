import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';
import { menu } from './main-menu';
import { menu_only_admin } from './main-menu-only-admin';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
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
