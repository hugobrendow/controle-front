import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Provider } from '../Provider';

@Injectable()
export class ProviderService implements Resolve<Provider[]> {
  rows: any;
  onInvoiceListChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient, private _coreSidebarService: CoreSidebarService) {
    this.onInvoiceListChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<Provider[]> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  
  getDataTableRows(): Promise<Provider[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<Provider[]>('http://localhost:8080/providers').subscribe((response: Provider[]) => {  
        this.rows = response;
        this.onInvoiceListChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  saveProvider(provider: Provider): Promise<Provider> {
    return this._httpClient.post<Provider>('http://localhost:8080/providers', provider).toPromise();
  }

  updateProvider(provider: Provider, id: number): Promise<Provider> {
    return this._httpClient.put<Provider>('http://localhost:8080/providers/' + id, provider).toPromise();
  }
  

}
