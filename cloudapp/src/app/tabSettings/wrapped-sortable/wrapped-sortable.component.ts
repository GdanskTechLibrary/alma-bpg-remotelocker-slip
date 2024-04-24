import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-wrapped-sortable',
  templateUrl: './wrapped-sortable.component.html',
  styleUrls: ['./wrapped-sortable.component.scss']
})
export class WrappedSortableComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() form_value_var = new EventEmitter<Array<any>>();
  @Input() idents_ordered = [];
  @Input() idents_checked = [];
  button_all_check_caption = 'check all';
  @Output() form_changed = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
    
  }
  check_all () {
    var form_value = this.form?.value;
    let isAllChecked = !this.check_all_checked();
    form_value.idents_checked.forEach((ident, i) => {
        form_value.idents_checked[i] = isAllChecked;
        const checkbox = document.getElementsByName('ident_ordered_'+i)[0] as HTMLInputElement;
        if (checkbox) {
            checkbox.checked  = isAllChecked;
        }
    });
    this.form_value_var.emit(form_value);
    this.form_changed.emit(true);
    this.button_all_check_caption = 'uncheck all';
    isAllChecked = this.check_all_checked();
  }
  checking(value_of_index) {
    var form_value = this.form?.value;
    form_value.idents_checked[value_of_index] = !form_value.idents_checked[value_of_index];
    this.form_value_var.emit(form_value);
    this.form_changed.emit(true);
  }
  listOrderChanged($event) {
    var form_value = this.form?.value;
    form_value.idents_ordered = $event;
    this.form_value_var.emit(form_value);
    this.form_changed.emit(true);
  }
  check_all_checked() {
    let checked_all = true;
    var form_value = this.form?.value;
    form_value.idents_checked.forEach((ident, i) => {
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
