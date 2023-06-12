import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastService } from '@core/services/toast.service';
import { ChargeCategory } from 'app/entities/ChargeCategory';
import { SubCategory } from 'app/entities/SubCategory';
import { ChargeCategoryService } from '../../charge.category.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html'
})
export class CreateCategorySidebarComponent implements OnInit {
  public toastStyle: object = {};
  public description;
  public identifierNumber;
  public category: ChargeCategory = new ChargeCategory();

  public errors = [];
  public items: SubCategory[] = [];

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private router: Router, private _coreSidebarService: CoreSidebarService, private toastService: ToastService, private _chargeCategoryService: ChargeCategoryService) {}

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
      console.log('Items: ', this.items);
      this.submitCharge(this.category);
      // this.clearForm();
    }
  }

  private parseObject() {
    this.category.description = this.description;
    this.category.identifierNumber = this.identifierNumber;
    this.category.subCategories = this.items;
  }

  submitCharge(provider: ChargeCategory) {
      this._chargeCategoryService.saveProvider(provider).then(data => {
        if (data.id) {
          this.successToast("Fornecedor cadastrado com sucesso!", 4000);
          this.toggleSidebar('create-category');
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
    this.identifierNumber = ' ';
    this.description = ' '
  }

  successToast(data, delayTime) {
    this.toastService.show(data, {
      delay: delayTime,
      autohide: true
    });
  }

  ngOnInit(): void {}

  addItem() {
    this.items.push(new SubCategory());
  }
  
  deleteItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items.indexOf(this.items[i]) === id) {
        this.items.splice(i, 1);
        break;
      }
    }
  }
}
