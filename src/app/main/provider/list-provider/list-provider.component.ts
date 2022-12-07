import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { CoreConfigService } from '@core/services/config.service';
import { InvoiceListService } from './invoice-list.service';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ProviderService } from './provider.service';
import { NgbModal, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '@core/services/toast.service';
import { Router } from '@angular/router';
import { Provider } from '../Provider';


@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  styleUrls: ['./list-provider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListProviderComponent implements OnInit, OnDestroy {
  // public
  public data: any;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public selectStatus: any = [
    { name: 'All', value: '' },
    { name: 'Downloaded', value: 'Downloaded' },
    { name: 'Draft', value: 'Draft' },
    { name: 'Paid', value: 'Paid' },
    { name: 'Partial Payment', value: 'Partial Payment' },
    { name: 'Past Due', value: 'Past Due' },
    { name: 'Sent', value: 'Sent' }
  ];

  public selectedStatus = [];
  public searchValue = '';
  public errors = [];

  public providerRemove;

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

  public providerEdit = new Provider();

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CalendarService} _calendarService
   * @param {InvoiceListService} _invoiceListService
   */
  constructor(
    private _providerService: ProviderService,
    private _coreConfigService: CoreConfigService,
    private _coreSidebarService: CoreSidebarService,
    private modalService: NgbModal,
    private httpClient: HttpClient,
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
    this.selectedStatus = this.selectStatus[0];

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
    this._providerService.getDataTableRows();
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
        this._providerService.onInvoiceListChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
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

  modalOpenDanger(modalDanger, provider) {
    this.providerRemove = provider
    this.modalService.open(modalDanger, {
      centered: true,
      windowClass: 'modal modal-danger'
    });
  }

  removerFornecedor() {
    this.httpClient.delete('http://localhost:8080/providers/' + this.providerRemove.id).subscribe(data => {
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
    this.providerEdit.id = row.id;
    this.providerEdit.fantasyName = row.fantasyName;
    this.providerEdit.socialName = row.socialName;
    this.providerEdit.cnpj = row.cnpj;
    this.providerEdit.inscription = row.inscription;

    this.modalService.open(modalForm);
  }

  updateProvider() {
    this._providerService.updateProvider(this.providerEdit, this.providerEdit.id).then(data => {
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