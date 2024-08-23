import { Component, OnInit, Injectable, Input, Output } from '@angular/core';
import { AppService } from '../../app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { CloudAppConfigService, CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib'; 
import { CloudAppRestService, InitData, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { ConfigLoader } from '../../commonComponents/configTreatment/configLoader';
import { Observable, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { WrappedSortableComponent } from './wrapped-sortable/wrapped-sortable.component';
import { TConfig, TItem } from '../../commonStatics/types';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})

export class ConfigComponent implements OnInit {
  form: FormGroup;
  saving = false;
  loading = false;
    config ?: TConfig;
  form_changed = false;
  button_all_check_caption = 'check all';
  circ_desk_form_control: any;
  circulation_desks_checked: FormControl;

  constructor(
    private restService: CloudAppRestService,
    private appService: AppService,
    private configService: CloudAppConfigService,
    private alert: AlertService,
    private eventsService: CloudAppEventsService

  ) { }

  ngOnInit() {
    this.loading = true;
    this.eventsService.getInitData().subscribe(data=>
        {   
        if (data.user.isAdmin) {
            this.appService.setTitle('Config');
            let configuration = new ConfigLoader(this.restService, this.configService);
            configuration.getConfig().subscribe(conf => 
                {
                    this.form = FormGroupUtil.toFormGroup(conf);
                    this.config = conf;
                    let items = conf?conf.items:[];
                    this.circulation_desks_checked = new FormControl(this.cast_items_id(items));
                    this.loading = false;
                });
            }
        });
    };//
  save() {
    new ConfigLoader(this.restService, this.configService).setConfig(this.config)
    .subscribe(() =>{
        this.saving = false;
        this.form_changed = false;
    });

  }
  change_circ_desks(e) {
    let items_id_casted_from_config = this.cast_items_id(this.config.items);
    
    let eval_diff_cdc = e.value.filter(x => !items_id_casted_from_config.includes(x));
    let cdc_diff_eval = items_id_casted_from_config.filter(x => !e.value.includes(x));
    
    if (eval_diff_cdc.length > 0) {
        this.config.items.push({
                item_id: eval_diff_cdc[0],
                name: this.config.circulation_desks[eval_diff_cdc[0]].circ_desk_name+
                '('+this.config.circulation_desks[eval_diff_cdc[0]].library_name+')',
                comment: null, 
                circulation_desk: this.config.circulation_desks[eval_diff_cdc[0]].circ_desk_code,
                library_code: this.config.circulation_desks[eval_diff_cdc[0]].library_code,
                link: '/item/'+eval_diff_cdc[0],
                icon: '',
                idents: {
                    order: this.config.user_identifier_types[0], 
                    check: [false, false, false, false, false, false, false, 
                            false, false, false, false, false, false, false, false]
                },
                show_primary_id: false,
                show_barcode: true,
                show_fullname: false,
                bottom_fullname: false,
                group_items_by_user: true
        });//
    }
    if (cdc_diff_eval.length > 0) {
        this.config.items = this.config.items.filter(item => item.item_id !== cdc_diff_eval[0]);
    }
    this.config.items.sort((a, b) => a.item_id - b.item_id);
    this.form = FormGroupUtil.toFormGroup(this.config);
    this.form_changed = true;
  }
  form_value_var(config_form: TConfig) {
    for(let i = 0; i < config_form.items.length; i++)
    {
        this.config.items[i].idents = config_form.items[i].idents;//
    }

    this.form_changed = true;
  }
  changeItemName(event, i) {
    this.config.items[i].name = event.target.value;
    this.form_changed = true;
  }
  setShowFullname(event, i) {
    this.config.items[i].show_fullname = event.target.checked;
    this.form_changed = true;
  }//
  setBottomFullname(event, i) {
    this.config.items[i].bottom_fullname = event.target.checked;
    this.form_changed = true;
  }//
  setGroupItemsByUser(event, i) {
    this.config.items[i].group_items_by_user = event.target.checked;
    this.form_changed = true;
  }//
  setShowPrimaryID(event, i) {
    this.config.items[i].show_primary_id = event.target.checked;
    this.form_changed = true;
  }//
  setShowBarcode(event, i) {
    this.config.items[i].show_barcode = event.target.checked;
    this.form_changed = true;
  }//
  removeTab(i:number, cdl: number) {
    this.config.items.splice(i,1);
    this.circulation_desks_checked = new FormControl(this.cast_items_id(this.config.items));
    this.form_changed = true;
  }
  reset() {
    this.configService.remove().subscribe( () => {
        let configuration = new ConfigLoader(this.restService, this.configService);
            configuration.retrieveFromAlmaToConfig();
        });
  }
  cast_items_id(items)
  {
    let items_id_casted = [];
    for (let i = 0; i < items.length; i++)
    {
        items_id_casted[i] = items[i].item_id;
    }
    return items_id_casted.sort((a, b) => a.item_id - b.item_id);
  }
  compareItems(o1: number, o2: number): boolean
  {
    return o1 === o2;
  }
}

