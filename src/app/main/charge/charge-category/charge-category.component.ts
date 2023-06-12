import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { CoreConfigService } from '@core/services/config.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { NgbModal, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ChargeCategory } from 'app/entities/ChargeCategory';
import { ChargeCategoryService } from '../charge.category.service';

@Component({
  selector: 'app-charge-category',
  templateUrl: './charge-category.component.html',
  styleUrls: ['./charge-category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChargeCategoryComponent implements OnInit, OnDestroy {
  // HEADER
  contentHeader = {
    headerTitle: 'Categorias de Despesa',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Home',
          isLink: true,
          link: '/'
        },
        {
          name: 'Parâmetros',
          isLink: true,
          link: '/parametros'
        },
        {
          name: 'Categorias',
          isLink: false
        }
      ]
    }
  }

  // public
  public data: any;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;

  public selectedStatus = [];
  public searchValue = '';
  public errors = [];

  public categoryRemove;

  // decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // private
  public sidebarToggleRef = false;
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  public rows = [];
  public tempFilterData;
  public previousStatusFilter = '';

  public success;

  public chargeCategoryEdit = new ChargeCategory();

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CalendarService} _calendarService
   * @param {InvoiceListService} _invoiceListService
   */
  constructor(
    private _chargeCategoryService: ChargeCategoryService,
    private _coreConfigService: CoreConfigService,
    private _coreSidebarService: CoreSidebarService,
    private modalService: NgbModal,
    private router: Router
    ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    // Reset ng-select on search

    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.client.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByStatus(event) {
    const filter = event ? event.value : '';
    this.previousStatusFilter = filter;
    this.tempFilterData = this.filterRows(filter);
    this.rows = this.tempFilterData;
  }

  /**
   * Filter Rows
   *
   * @param statusFilter
   */
  filterRows(statusFilter): any[] {
    // Reset search on select change
    this.searchValue = '';

    statusFilter = statusFilter.toLowerCase();

    return this.tempData.filter(row => {
      const isPartialNameMatch = row.invoiceStatus.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch;
    });
  }

  ngOnInit(): void {
    this._chargeCategoryService.getDataTableRows();
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
        this._chargeCategoryService.onInvoiceListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          this.data = response;
          this.rows = this.data;
          this.tempData = this.rows;
          this.tempFilterData = this.rows;
        });
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.success = null;
    this.errors = [];
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  modalOpenDanger(modalDanger, category) {
    this.categoryRemove = category
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: 'modal modal-danger'
    });
  }

  removeCategory() {
    this._chargeCategoryService.removeCategory(this.categoryRemove.id).then(data => {
        this.refreshPage();
      }, err => {
        let message = err.error.message
        console.log('Error: ', message)
        this.errors = [
          {
            title: 'Erro',
            message: message
          }
        ]
      }
    );
    this.modalService.dismissAll();
  }

  refreshPage() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  modalOpenForm(modalForm) {
    this.modalService.open(modalForm);
  }

  modalEditOpenForm(modalForm, row) {
    console.log('Row: ', row);
    this.chargeCategoryEdit.id = row.id;
    this.chargeCategoryEdit.description = row.description;
    this.chargeCategoryEdit.identifierNumber = row.identifierNumber;
    this.chargeCategoryEdit.subCategories = row.subCategories;

    this.modalService.open(modalForm);
  }

  updateProvider() {
    this._chargeCategoryService.updateProvider(this.chargeCategoryEdit, this.chargeCategoryEdit.id).then(data => {
      if (data.id) {
        this.refreshPage();
        this.success = {
          title: 'Sucesso ao Editar',
          message: 'Sucesso ao editar o Fornecedor com ID: ' + data.id
        }
      }
    }, err => {
      let message = err.error.message
      console.log('Error: ', message)
      this.errors = [
        {
          title: 'Erro',
          message: message
        }
      ]
    }
    );
    this.modalService.dismissAll();
  }
}