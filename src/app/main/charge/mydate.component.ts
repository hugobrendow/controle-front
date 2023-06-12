import {Component, NgModule,  ElementRef, forwardRef, Input, ViewChild, HostListener} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'my-date-picker',
  template: `<div class="input-group">
              <input container="body" class="form-control" placeholder="" [name]="name" [(ngModel)]="model" 
              (ngModelChange)="onModelChange()" ngbDatepicker #dp="ngbDatepicker" required>
              <div class="input-group-append">
                <button class="btn btn-outline-secondary feather icon-calendar" (click)="dp.toggle()"
                    type="button" rippleEffect></button>
                </div>
            </div>`,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MyDatePickerComponent), multi: true }]
})
export class MyDatePickerComponent implements ControlValueAccessor {
  @Input() name: string = '';
  @Input() model: any;
  @ViewChild('dp') dp;
  private propagateChange:any = () => {};
  
  constructor(private _eref: ElementRef) { }
  
  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (this._eref.nativeElement.contains(event.target)) return true;
    setTimeout(() => this.dp.close(), 10);
  }
  
  onModelChange() {
    this.propagateChange(this.model);
  }
  
  writeValue(value) {
      this.model = value;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}