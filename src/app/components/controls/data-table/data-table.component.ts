import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { settings } from 'cluster';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, AfterViewInit {
  @ViewChild("table", {static:true} ) tableHtml: ElementRef;
  @Input() data: Observable<any>;
 // @Input() columns: Array<GPFIDataTables.ColumnDefs>;


  dataTableSettings: DataTables.Settings;
  columnSettings: DataTables.ColumnSettings 
  columnDef: DataTables.ColumnDefsSettings;

  constructor() {
  }

  ngAfterViewInit(): void {
    let dt = $(this.tableHtml.nativeElement).DataTable(this.constructTableSettings());

  }

  constructTableSettings = () => {
    let columnSettings : DataTables.ColumnSettings = { name : "Test", data : 'test', title:'test'};
    let columnDef: DataTables.ColumnDefsSettings = {
      targets: "no-sort",
      orderable: false
    }
    let dataTableSettings:DataTables.Settings  = {
      columns: [columnSettings],
      columnDefs:[columnDef],
      data:[{ 'test' : "test1"}, { 'test' : "test2"}],
      paging:false,
      info:false,
      ordering:false,
      searching:false
    }

    return dataTableSettings;
  }

  /*private constructColumnDefinitions(){
      let columnSettingsArray: Array<DataTables.ColumnSettings>;
      from(this.columns).pipe(
        map(setting => new GPFIDataTables.HandleColumnSettings(setting).dataTablesColSettings)
      )
  }*/

  ngOnInit() {
  }

}


  /*export class HandleColumnSettings{

    dataTablesColSettings : DataTables.ColumnSettings;

    constructor(setting: ColumnDefs){
      Object.entries(settings).forEach(([key, value]) => value && this[key + "_Func"](value));
    }

    getDataTablesColumns(){
      return this.dataTablesColSettings;
    }

    header_Func(header: string){
      this.dataTablesColSettings.className = header;
    }


  }*/



  // TODO:- Add description to each property

  export interface ColumnDefs{
    /**
     * Represents the Key property in the Data Object which this Column will be mapped to.
     */
    key?: string;
    /**
     * The Name of the Column Header, If not set then the Key Name will be used as the Column Header
     */
    header?: string;
    /**
     * The class name that will be attached to the cells that are part of the columns of the grid.
     */
    className?: string;
    calculateTotal?:boolean;
    /**
     * The Default text which will appear in the column cell
     */
    default?: string;
    /**
     * A callback used to create dynamic data for the cell. //TODO:- add more information and describe return function 
     */
    cellElement?:DataTables.FunctionColumnCreatedCell;
    translate?: boolean;
    formatter?:DataTables.FunctionColumnRender;
    /** TODO:- Create an Enum for this type */
    Type?:any;
    Sortable?:string;
    CollapseGrid?: string;
    Width?:number;
    HideCollapsed?:boolean;
    DetailColumn?:any;
  }

