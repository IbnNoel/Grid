import { NgModule } from '@angular/core';
import { DataTableComponent } from '../components/controls/data-table/data-table.component';


@NgModule({
  declarations: [DataTableComponent],
  exports:[
    DataTableComponent,
  ]
})
export class WidgetsModule { }
