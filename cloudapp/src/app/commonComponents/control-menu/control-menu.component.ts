import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-topmenu',
  templateUrl: './control-menu.component.html',
  styleUrls: ['./control-menu.component.scss']
})
export class ControlMenuComponent implements OnInit {
  route: Router;
  title: String;

  constructor(private router: Router, private appService: AppService) { 
    this.route = router; 
  }

  ngOnInit() {
    this.appService.getTitle().subscribe(appTitle => this.title = appTitle);
  }

}
