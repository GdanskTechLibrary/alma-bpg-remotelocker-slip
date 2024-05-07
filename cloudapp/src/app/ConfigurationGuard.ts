import { CanActivate, Router } from '@angular/router';
import { Observable, iif, of } from 'rxjs';
import { CloudAppRestService, CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib'; 
import { map, switchMap } from 'rxjs/operators';
import { Component, OnInit, Injectable, Input, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationGuard implements CanActivate {
  constructor (
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.eventsService.getInitData().pipe(
      switchMap( initData => this.restService.call(`/users/${initData.user.primaryId}`)),
      map( user => {
        if (!user.user_role.some(role=>role.role_type.value=='221')) {
          this.router.navigate(['/'], 
            { queryParams: { error: "Brak uprawnień" }});
          return false;
        }
        return true;
      })
    );
  }
}