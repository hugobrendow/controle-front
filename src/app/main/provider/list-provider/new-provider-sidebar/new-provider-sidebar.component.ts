import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastService } from '@core/services/toast.service';
import { clear } from 'console';
import { title } from 'process';
import { Provider } from '../../Provider';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-new-provider-sidebar',
  templateUrl: './new-provider-sidebar.component.html'
})
export class newProviderSidebarComponent implements OnInit {
  public toastStyle: object = {};
  public fantasyName;
  public socialName;
  public cnpj;
  public inscription;
  public provider = new Provider();

  public errors = [];

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private router: Router, private _coreSidebarService: CoreSidebarService, private toastService: ToastService, private providerService: ProviderService) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this.errors = [];
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      this.parseObject();
      this.submitProvider(this.provider);
      this.clearForm();
    }
  }

  private parseObject() {
    this.provider.cnpj = this.cnpj;
    this.provider.fantasyName = this.fantasyName;
    this.provider.socialName = this.socialName;
    this.provider.inscription = this.inscription;
  }

  submitProvider(provider: Provider) {
      this.providerService.saveProvider(provider).then(data => {
        if (data.id) {
          this.successToast("Fornecedor cadastrado com sucesso!", 4000);
          this.toggleSidebar('new-provider-sidebar');
          this.refreshPage();
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
  }

  refreshPage() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  clearForm() {
    this.cnpj = '';
    this.fantasyName = '';
    this.socialName = '';
    this.inscription = '';
  }

  successToast(data, delayTime) {
    this.toastService.show(data, {
      delay: delayTime,
      autohide: true
    });
  }

  ngOnInit(): void {}
}
