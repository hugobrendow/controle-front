import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';


import { ListProviderComponent } from './list-provider/list-provider.component';
import { CommonModule } from '@angular/common';
import { CoreDirectivesModule } from '@core/directives/directives';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreSidebarModule } from '@core/components';
import { InvoiceListService } from './list-provider/invoice-list.service';
import { newProviderSidebarComponent } from './list-provider/new-provider-sidebar/new-provider-sidebar.component';
import { ProviderService } from './list-provider/provider.service';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

const routes = [
  {
    path: '',
    component: ListProviderComponent,
    data: { animation: 'sample' }
  }
];

@NgModule({
  declarations: [
    ListProviderComponent,
    newProviderSidebarComponent
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
    CoreSidebarModule],
  exports: [ListProviderComponent],
  providers: [InvoiceListService, ProviderService]
})
export class ProviderModule {}
