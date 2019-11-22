import {AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';

import 'datatables.net';
import 'datatables.net-bs';

import 'datatables.net-responsive';
import 'datatables.net-responsive-bs';

import {Observable, BehaviorSubject} from 'rxjs';
import {PageSettings, PagingHelper} from './classes/Paging';
import {ColumnDefs, HandleColumnSettings} from './classes/Columns';
import { ExpansionSettings, RenderedResponsiveCollapsedHelper, ExpansionSettingsHandler } from './classes/Expansion';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  @ViewChild("table", {static: true}) tableHtml: ElementRef;

  @ViewChild('table', {static: true, read: ViewContainerRef}) VCR: ViewContainerRef;
  /*@Input() detailRow?: boolean;
  @Input() detailRowCallback?: any;
  @Input() expandEvent?: Observable<any>;
  @Input() collapseEvent?: Observable<any>;*/

  @Input() Data: Observable<Array<any>>;
  @Input() Columns: Array<ColumnDefs>;
  @Input() PageSettings?: PageSettings;
  @Input() ExpansionSettings? : ExpansionSettings;
  @Input() CollapseOnRender?: boolean;

  dataTableApi: DataTables.Api;
  dataTableSettings: DataTables.Settings;
  columnSettings: DataTables.ColumnSettings
  columnDef: DataTables.ColumnDefsSettings;
  pagingHelper: PagingHelper;
  pageChangeData: Observable<any>;
  tableSettings: DataTables.Settings;
  expansionSettingsHandler : ExpansionSettingsHandler = new ExpansionSettingsHandler();
  renderedResponsiveCollapsedHelper: RenderedResponsiveCollapsedHelper = new RenderedResponsiveCollapsedHelper();
  
  onGridInit$ = new BehaviorSubject<{api:DataTables.Api, tableDom:any}>(null);


  constructor(private CFR: ComponentFactoryResolver) {
  }

  ngAfterViewInit(): void {
    this.constructTableSettings();
    this.initRenderOnCollapse();
    console.log(this.tableSettings);
    debugger;
    this.dataTableApi = $(this.tableHtml.nativeElement).DataTable(this.tableSettings);
    this.onGridInit$.next({api: this.dataTableApi, tableDom: this.tableHtml.nativeElement});

    this.initPaging();

    this.Data.subscribe(data => {
      this.initTable(data);
    });

    this.dataTableApi.on('draw',(param) => {
      this.onGridInit$.next({api: this.dataTableApi, tableDom: this.tableHtml.nativeElement});
    });

    /*
    if (this.detailRow) {
      this.expandEvent.subscribe(value => {
        if (Object.keys(value).length > 0) {
          const row = this.dataTableApi.row(value.row);
          $("table tr .expanded").parent().remove();
            let parentDiv = $("<div class='expanded'></div>");
            parentDiv.append(this.detailRowCallback(value.data))
            row.child(parentDiv).show();
        };
      });
      this.collapseEvent.subscribe(value => {
        $("table tr .expanded").parent().remove();
      });
    }*/


  }

  constructTableSettings = () => {
    let columnSettings = this.constructColumnSettings();

    let dataTableSettings: DataTables.Settings = {
      columns: columnSettings,
      info: false,
      ordering: false,
      searching: false,
      language: {
        lengthMenu: "_MENU_"
      },
      paging: !!(this.PageSettings),
      dom: (this.PageSettings) ? "<'responsive-tables p20'<'container-fluid'<'row gpfiPageLengthControl' <'clearfix'> l><'row't><'row'p>>>" :
        "<'responsive-tables p20'<'container-fluid'<'row't>>>",
      lengthMenu: [[10, 20, 30, 50], ["Show 10 per page", "Show 20 per page", "Show 30 per page", "Show 50 per page"]]
    }
    this.tableSettings = dataTableSettings;
  }

  initTable(data) {
    if (this.PageSettings) {
      this.pagingHelper.initPaging(() => {
        this.createTable(data);
        /*  if (!update || !ctrl.detailRow) {
              table.draw(false);
         }*/
      })
    } else {
      this.createTable(data);
      /*  if (!update || !ctrl.detailRow) {
               table.draw();
      }*/
    }

  }

  initPaging() {
    if (this.PageSettings) {
      this.pagingHelper = new PagingHelper(this.dataTableApi, this.PageSettings);
    }
  }

  initRenderOnCollapse(){
    if(this.CollapseOnRender){
      this.renderedResponsiveCollapsedHelper.setupExpansionSettings(this.tableSettings,this.expansionSettingsHandler, this.onGridInit$);
    }
  }

  onGridInit = (func : (tblSettings : DataTables.Api) => void) => {
    //this.dataTableApi.on
  }

  createTable(data) {
    this.dataTableApi.clear();
    this.dataTableApi.rows.add(data);
    this.dataTableApi.draw();
  }

  private constructColumnSettings(): Array<DataTables.ColumnSettings> {
    
    return _.map(this.Columns, (setting) => { 
      return new HandleColumnSettings(setting, this).getDataTablesColumns()});
  }

  ngOnInit() {
  }

}

