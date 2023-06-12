import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { Charge } from 'app/entities/Charge';
import { ChargeCategory } from 'app/entities/ChargeCategory';
import { Installment } from 'app/entities/Installment';
import { ChargeCategoryService } from '../charge.category.service';

@Component({
  selector: 'app-new-charge',
  templateUrl: './new-charge.component.html',
  styleUrls: ['./new-charge.component.scss']
})
export class NewChargeComponent implements OnInit, OnDestroy {
  // public
  public apiData;
  public sidebarToggleRef = false;
  public invoiceSelect;
  public invoiceSelected;
  public isPaid = false;

  public basicDateOptions: FlatpickrOptions = {
    altInput: true
  }

  // Charge
  public charge: Charge = new Charge();
  public chargeCategory: ChargeCategory = new ChargeCategory();
  public installments: Installment[] = [];
  public items = [];

  // Providers
  public providers = [];
  // Category
  public categories = [];
  // Sub-Categories
  public subCategories = [];

  // CategoryObject
  public categoriesObject = [];

  // Selected
  public categorySelected;
  public subCategorySelected;


  //Calendar
  public CustomDayDPdata: NgbDateStruct;
  public today = this.calendar.getToday();

  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6;

  isDisabled = (date: NgbDate, current: { month: number; year: number }) =>
  date.month !== current.month;

  save() {
    this.charge.installments = this.items;
    console.log('Charges: ', this.charge);
  }

  private _unsubscribeAll: Subject<any>;

  constructor(private _coreSidebarService: CoreSidebarService,
    private calendar: NgbCalendar,
    private chargeCategoryService: ChargeCategoryService
    ) {
    this._unsubscribeAll = new Subject();
  }

  onPaidChange(value: boolean) {
    this.isPaid = value;
  }

  addItem() {
    this.items.push(
      {
        id: '',
        value: '',
        paidValue: '',
        barcode: '',
        status: null,
        dueDate: '',
        paymentDate: ''
      }
    );
  }

  deleteItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.indexOf(this.items[i]) === id) {
        this.items.splice(i, 1);
        break;
      }
    }
  }

  toggleSidebar(name) {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  ngOnInit(): void {
    this.chargeCategoryService.listAllProviders().then(data => {
      this.categoriesObject = data;
      this.categories = data.map((object) => {
        return {
          id: object.id,
          name: object.description
        }
      });
    });
  }

  public customDateOptions: FlatpickrOptions = {
    altFormat: 'j-m-Y',
    altInput: true
  };

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getTotalBoletos() {
    let total = 0;
    this.items.forEach(it => {
      total += it.value;
    });

    return total;
  }

  getTotalPago() {
    let total = 0;
    this.items.forEach(it => {
      total += it.paidValue;
    });

    return total;
  }

  getUltimaParcela() {
    let data = new Date();
    this.items.forEach(it => {
      let dateString = ''+it.dueDate.year+'-'+it.dueDate.month+'-'+it.dueDate.day;
      let dataCompare = new Date(dateString);
      if (dataCompare > data) {
        data = dataCompare;
        data.setDate(dataCompare.getDate() + 1);
      }
    });

    return this.format(data);
  }

  getDateBoleto(item) {
    if (item) {
      let dateString = ''+ item.year+'-'+ item.month+'-'+ item.day;
      let data = new Date(dateString);
      data.setDate(data.getDate() + 1);
      return this.format(data);
    }
    return '';
  }

  format(inputDate) {
    let date, month, year;

    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();

      date = date
          .toString()
          .padStart(2, '0');

      month = month
          .toString()
          .padStart(2, '0');

    return `${date}/${month}/${year}`;
  }

  getTotalPendente() {
    return this.getTotalBoletos() - this.getTotalPago();
  }

  loadSubCategory() {
    
  }
}