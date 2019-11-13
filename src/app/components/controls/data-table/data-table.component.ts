import {AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';

import 'datatables.net';
import 'datatables.net-bs';

import {Observable} from 'rxjs';
import {PageSettings, PagingHelper} from './classes/Paging';
import {ColumnDefs, HandleColumnSettings} from './classes/Columns';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  @ViewChild("table", {static: true}) tableHtml: ElementRef;
  @ViewChild('table', {static: true, read: ViewContainerRef}) VCR: ViewContainerRef;

  @Input() expandEvent?: Observable<any>;
  @Input() collapseEvent?: Observable<any>;
  @Input() Data: Observable<Array<any>>;
  @Input() Columns: Array<ColumnDefs>;
  @Input() PageSettings: PageSettings;
  @Input() detailRow?: boolean;
  @Input() detailRowCallback?: any;
  dataTableApi: DataTables.Api;
  dataTableSettings: DataTables.Settings;
  columnSettings: DataTables.ColumnSettings
  columnDef: DataTables.ColumnDefsSettings;
  pagingHelper: PagingHelper;
  pageChangeData: Observable<any>;


  constructor(private CFR: ComponentFactoryResolver) {
  }

  ngAfterViewInit(): void {
    this.dataTableApi = $(this.tableHtml.nativeElement).DataTable(this.constructTableSettings());
    this.initPaging();

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
    }

    this.Data.subscribe(data => {
      this.initTable(data);
    });
  }

  constructTableSettings = () => {
    let columnSettings = this.constructColumnSettings();
    console.log(columnSettings);
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
      lengthMenu: [[10, 20, 30, 50], ["showTenPerPage", "showTwentyPerPage", "showThirtyPerPage", "showFiftyPerPage"]]
    }
    return dataTableSettings;
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

  createTable(data) {
    this.dataTableApi.clear();
    this.dataTableApi.rows.add(data);
    this.dataTableApi.draw();
  }

  private constructColumnSettings(): Array<DataTables.ColumnSettings> {
    return _.map(this.Columns, (setting) => new HandleColumnSettings(setting, this.VCR, this.CFR).getDataTablesColumns());
  }

  ngOnInit() {
  }

}

