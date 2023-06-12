import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ChargeCategory } from 'app/entities/ChargeCategory';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ChargeCategoryService implements Resolve<ChargeCategory[]> {
  rows: any;
  onInvoiceListChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient, private _coreSidebarService: CoreSidebarService) {
    this.onInvoiceListChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<ChargeCategory[]> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  
  getDataTableRows(): Promise<ChargeCategory[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<ChargeCategory[]>('http://localhost:8080/charges/category').subscribe((response: ChargeCategory[]) => {  
        this.rows = response;
        this.onInvoiceListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  listAllProviders() {
    return this._httpClient.get<ChargeCategory[]>('http://localhost:8080/charges/category').toPromise();
  }

  saveProvider(provider: ChargeCategory): Promise<ChargeCategory> {
    return this._httpClient.post<ChargeCategory>('http://localhost:8080/charges/category', provider).toPromise();
  }

  updateProvider(provider: ChargeCategory, id: number): Promise<ChargeCategory> {
    return this._httpClient.put<ChargeCategory>('http://localhost:8080/charges/category/' + id, provider).toPromise();
  }

  removeCategory(id: number): Promise<ChargeCategory> {
    return this._httpClient.delete<ChargeCategory>('http://localhost:8080/charges/category/' + id).toPromise();
  }
  

}
