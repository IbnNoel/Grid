import {Component} from '@angular/core';
import { ColumnDefs, GPFIButton } from './components/controls/data-table/classes/Columns';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pricing-main',
  templateUrl: './refunds.component.html'
})
export class RefundsComponent {


  colDefinitions: Array<ColumnDefs>;
  
  data = new BehaviorSubject<Array<any>>([]);

  constructor(){ 

    this.setUpColumnDefintions();
    this.data.next([{
      name: "Mike",
      test1: "test1",
      test2: true
    }])
  }

  setUpColumnDefintions(){
    this.colDefinitions = [
      {key:"name", className: "data_grid_left_align", header:"Name"},
      {key:"test1", className: "data_grid_center_align", header:"Test one"},
      {key:"test2", className: "data_grid_center_align", header:"Test two", formatter: (data) => {
        return data ? "Yes" : "No";
      }},
      { cellElement: () => {
        return new GPFIButton("CONFIGURE", (data) => { 
          console.log(data.clientId); 
        });
      }, className: "data_grid_center_align"
    }];
  }

}
