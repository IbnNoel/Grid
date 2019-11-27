import { NgModule } from '@angular/core';
import { DataTableComponent } from '../components/controls/data-table/data-table.component';
import {MatCheckboxModule} from '@angular/material';


@NgModule({
  declarations: [DataTableComponent],
  exports:[
    DataTableComponent, MatCheckboxModule
  ]
})
export class DataTableModule { }
