import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class InvoiceListService implements Resolve<any> {
  rows: any;
  onInvoiceListChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _coreSidebarService: CoreSidebarService) {
    // Set the defaults
    this.onInvoiceListChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/invoice-data').subscribe((response: any) => {
        this.rows = response;
        this.onInvoiceListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
}
