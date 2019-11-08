import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';

import 'datatables.net';
import  'datatables.net-bs';

import { Observable, of, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';
import { _runtimeChecksFactory } from '@ngrx/store/src/runtime_checks';
import { PageSettings, PagingHelper } from './classes/Paging';
import { HandleColumnSettings, ColumnDefs } from './classes/Columns';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  @ViewChild("table", {static:true} ) tableHtml: ElementRef;
  @Input() Data: Observable<Array<any>>;
  @Input() Columns: Array<ColumnDefs>;
  @Input() PageSettings: PageSettings;

  dataTableApi: DataTables.Api;
  dataTableSettings: DataTables.Settings;
  columnSettings: DataTables.ColumnSettings 
  columnDef: DataTables.ColumnDefsSettings;
  pagingHelper: PagingHelper;
  pageChangeData: Observable<any>;

  constructor() {}

  ngAfterViewInit(): void {
    this.dataTableApi = $(this.tableHtml.nativeElement).DataTable(this.constructTableSettings());
    this.initPaging();
    
    this.Data.subscribe( data => {
      this.initTable(data);
    });
  }

  constructTableSettings = () => {
    let columnSettings = this.constructColumnSettings();
    console.log(columnSettings);
    let dataTableSettings:DataTables.Settings  = {
      columns: columnSettings,
      info:false,
      ordering:false,
      searching:false,
      language: {
        lengthMenu: "_MENU_"
      },
      paging: !!(this.PageSettings),
      dom: (this.PageSettings) ? "<'responsive-tables p20'<'container-fluid'<'row gpfiPageLengthControl' <'clearfix'> l><'row't><'row'p>>>" :
        "<'responsive-tables p20'<'container-fluid'<'row't>>>",
      lengthMenu: [[10, 20, 30, 50], ["showTenPerPage", "showTwentyPerPage", "showThirtyPerPage", "showFiftyPerPage"]]
    }
    return dataTableSettings;
  }

  initTable(data){
    if(this.PageSettings){
      this.pagingHelper.initPaging(() => {
        this.createTable(data);
        /*  if (!update || !ctrl.detailRow) {
              table.draw(false);
         }*/
      })
    }else{
      this.createTable(data);
     /*  if (!update || !ctrl.detailRow) {
              table.draw();
     }*/
    }
  
  }

  initPaging(){
    if(this.PageSettings){
      this.pagingHelper = new PagingHelper(this.dataTableApi, this.PageSettings);
    }
  }

  createTable(data){
    this.dataTableApi.clear();
    this.dataTableApi.rows.add(data);
    this.dataTableApi.draw();
  }

  private constructColumnSettings(): Array<DataTables.ColumnSettings>{
      return _.map(this.Columns, (setting) =>  new HandleColumnSettings(setting).getDataTablesColumns());
  }

  ngOnInit() {
  }

}

