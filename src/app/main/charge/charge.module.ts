import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CommonModule } from '@angular/common';
import { CoreDirectivesModule } from '@core/directives/directives';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreSidebarModule } from '@core/components';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ChargeListComponent } from './charge-list/charge-list.component';
import { ChargeCategoryService } from './charge.category.service';
import { ChargeCategoryComponent } from './charge-category/charge-category.component';
import { CreateCategorySidebarComponent } from './charge-category/create-category/create-category.component';
import { ChargeListService } from './charge-list/charge-list.service';
import { NewChargeComponent } from './new-charge/new-charge.component';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { MyDatePickerComponent } from './mydate.component';

const routes = [
  {
    path: '',
    component: ChargeListComponent,
    data: { animation: 'sample' }
  },
  {
    path: 'despesas',
    component: ChargeCategoryComponent,
    data: { animation: 'sample' }
  },
  {
    path: 'adicionar',
    component: NewChargeComponent,
    data: { animation: 'sample' }
  }
];

@NgModule({
  declarations: [
    ChargeListComponent,
    ChargeCategoryComponent,
    CreateCategorySidebarComponent,
    NewChargeComponent,
    MyDatePickerComponent
  ],
  imports: [
    ContentHeaderModule,
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    CoreDirectivesModule,
    NgxDatatableModule,
    FormsModule,
    CorePipesModule,
    NgbModule,
    NgSelectModule,
    CoreSidebarModule,
    Ng2FlatpickrModule,
    CardSnippetModule
  ],
  exports: [ChargeListComponent, ChargeCategoryComponent, CreateCategorySidebarComponent, NewChargeComponent, MyDatePickerComponent],
  providers: [ChargeCategoryService, ChargeListService]
})
export class ChargeModule {}
