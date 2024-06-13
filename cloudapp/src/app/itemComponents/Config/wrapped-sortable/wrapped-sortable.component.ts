import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TConfig } from '../../../commonStatics/types';

import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-wrapped-sortable',
  templateUrl: './wrapped-sortable.component.html',
  styleUrls: ['./wrapped-sortable.component.scss']
})
export class WrappedSortableComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() config_form = new EventEmitter<TConfig>();
  @Input() idents_ordered = [];
  @Input() idents_checked = [];
  @Input() circ_desk_l: number;
  @Input() arr_ind: number;
  @Input() disabled_list: boolean;
  button_all_check_caption = 'check all';

  constructor() { }

  ngOnInit(): void {
//    
  }
  check_all () {
    var form_value = this.form?.value;
    let areAllChecked = !this.are_all_checked();
    console.log(form_value.items,this.arr_ind);
    form_value.items[this.arr_ind].idents.check.forEach((check, i) => {
        
        form_value.items[this.arr_ind].idents.check[i] = areAllChecked;
        const checkbox = document.getElementsByName('ident_ordered_'+i)[0] as HTMLInputElement;
        if (checkbox) {
            checkbox.checked  = areAllChecked;
        }
    });
    this.button_all_check_caption = 'uncheck all';
    areAllChecked = this.are_all_checked();
    this.config_form.emit(form_value);
  }
  checking(value_of_index) {
    var form_value = this.form?.value;
    form_value.items[this.arr_ind].idents.check[value_of_index] = !form_value.items[this.arr_ind].idents.check[value_of_index];
    this.config_form.emit(form_value);
  }
  listOrderChanged($event) {
    var form_value = this.form?.value;
    form_value.items[this.arr_ind].idents.order = $event;
    this.config_form.emit(form_value);
  }
  are_all_checked() {
    let checked_all = true;
    var form_value = this.form?.value;
    form_value.items[this.arr_ind].idents.check.forEach((ident, i) => {
        if (!ident) {
            checked_all = false;
        };
    });//
    if (checked_all) {
        this.button_all_check_caption = 'uncheck all';
    } else {
        this.button_all_check_caption = 'check all';
    }
    return checked_all;
  }
}
