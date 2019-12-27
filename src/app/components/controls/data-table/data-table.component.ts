import {AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef, QueryList, ViewChildren} from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';

import 'datatables.net';
import 'datatables.net-bs';

import 'datatables.net-responsive';
import 'datatables.net-responsive-bs';

import {Observable, BehaviorSubject} from 'rxjs';
import {PageSettings, PagingHelper} from './classes/Paging';
import {ColumnDefs, HandleColumnSettings} from './classes/Columns';
import { ExpansionSettings, ExpansionSettingsHandler } from './classes/Expansion';
import { RenderedResponsiveCollapsedHelper } from './classes/CollapsedResponsive';
import { TranslateService } from '@ngx-translate/core';
import { CheckBoxSettings, CheckBoxHelper } from './classes/CheckBox';
import { FooterSettings, FooterSettingsHelper } from './classes/Footer';
import { GeneralSettings, GeneralSettingsHelper } from './classes/General';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  @ViewChild('table', {static: true}) tableHtml: ElementRef;
  @ViewChild('table', {static: true, read: ViewContainerRef}) VCR: ViewContainerRef;

  @Input() Data: Observable<Array<any>>;
  @Input() Columns: Array<ColumnDefs>;
  @Input() PageSettings?: PageSettings;
  @Input() ExpansionSettings?: ExpansionSettings;
  @Input() CheckBoxSettings?: CheckBoxSettings;
  @Input() CollapseOnRender = true;
  @Input() FooterSettings?: FooterSettings;
  @Input() GeneralSettings?: GeneralSettings;
  @Input('row-id') RowId?: string;

  dataTableApi: DataTables.Api;
  dataTableSettings: DataTables.Settings;
  columnSettings: DataTables.ColumnSettings;
  columnDef: DataTables.ColumnDefsSettings;
  pagingHelper: PagingHelper;
  pageChangeData: Observable<any>;
  tableSettings: DataTables.Settings;
  expansionSettingsHandler: ExpansionSettingsHandler = new ExpansionSettingsHandler();
  generalSettingsHelper: GeneralSettingsHelper;
  renderedResponsiveCollapsedHelper: RenderedResponsiveCollapsedHelper = new RenderedResponsiveCollapsedHelper();
  onGridInit$ = new BehaviorSubject<{api: DataTables.Api, tableDom: any}>(null);
  translateService: TranslateService;

  constructor(public CFR: ComponentFactoryResolver, translate: TranslateService) {
    this.translateService = translate;
  }

  ngAfterViewInit(): void {
    this.constructTableSettings();
    this.constructColumnSettings();
    
    this.initRenderOnCollapse();
    this.initExpansionHandler();
    this.initFooterSettings();
    this.setUpUpdateSettings();

    this.dataTableApi = $(this.tableHtml.nativeElement).DataTable(this.tableSettings);
    this.onGridInit$.next({api: this.dataTableApi, tableDom: this.tableHtml.nativeElement});

    this.initPaging();

    this.Data.subscribe(data => {
      this.initTable(data);
    });

    this.dataTableApi.on('draw', (param) => {
      /** Todo :- create a generic event function with speck enum valuesa */
      // this.onGridInit$.next({api: this.dataTableApi, tableDom: this.tableHtml.nativeElement});
    });
  }

  constructTableSettings = () => {
    this.tableSettings = {
      info: false,
      ordering: false,
      searching: false,
      language: {
        lengthMenu: '_MENU_'
      },
      paging: !!(this.PageSettings),
      dom: (this.PageSettings) ? '<\'responsive-tables p20\'<\'container-fluid\'<\'row gpfiPageLengthControl\' <\'clearfix\'> l><\'row\'t><\'row\'p>>>' :
        '<\'responsive-tables p20\'<\'container-fluid\'<\'row\'t>>>',
      lengthMenu: [[10, 20, 30, 50], ['Show 10 per page', 'Show 20 per page', 'Show 30 per page', 'Show 50 per page']]
    };
  }

  private initTable(data) {
    // check if any of the rows are expanded

    if (this.PageSettings) {
      this.pagingHelper.initPaging(() => {
        this.createTable(data);
      });
    } else {
      this.createTable(data);
    }
  }

  private isUpdateNeeded(){
    let expandedRows = $(this.tableHtml.nativeElement).find("tr.shown");
    let update = false;
    if (expandedRows.length > 0 && this.RowId != null) {
        update = true;
    }
    return update;
  }


  private setUpUpdateSettings(){
    this.generalSettingsHelper = new GeneralSettingsHelper(this);
    if(this.GeneralSettings){
      this.GeneralSettings.GeneralSettings = this.generalSettingsHelper;
    }
  }

  private initPaging() {
    if (this.PageSettings) {
      this.pagingHelper = new PagingHelper(this);
    }
  }

  private initRenderOnCollapse() {
    if (this.CollapseOnRender) {
      this.renderedResponsiveCollapsedHelper.init(this);
    }
  }

  private createTable(data) {
    let performUpdate = this.isUpdateNeeded();

    if(performUpdate){
      this.updateTable(data);
    }else{
      this.dataTableApi.clear();
      this.dataTableApi.rows.add(data);
      //if(!this.ExpansionSettings){
        this.dataTableApi.draw(!!this.PageSettings);
      //}
    }
  }

  private updateTable(gridData){
    if(gridData.length == 0){
      this.dataTableApi.clear();
      this.dataTableApi.draw();
    }else{
      for (var i = 0; i < gridData.length; i++) {
        var rowInfo = {id: gridData[i][this.RowId], propertyName: this.RowId};
        this.generalSettingsHelper.UpdateRow(rowInfo, gridData[i]);
      }
      let deletedRows = this.dataTableApi.rows((idx, data, node) => {
        var delRow = gridData.filter((obj) => {
            return obj[this.RowId] == data[this.RowId];
        });
        if (delRow.length == 0){
            return this.dataTableApi.row(idx).data();
        }
      });
      if (deletedRows.nodes().length > 0) {
        deletedRows.remove().draw(false);
      }
    }
  }

  private initExpansionHandler() {
    if (this.CollapseOnRender || this.ExpansionSettings) {
      this.expansionSettingsHandler.init(this);
      if (this.ExpansionSettings) {
        this.ExpansionSettings._expansionSettingHandler = this.expansionSettingsHandler;
      }
    }
  }

  private constructColumnSettings() {
    // TODO:- MOVE INTO OWN METHOD
    if(this.CheckBoxSettings){
      let cbHelper = new CheckBoxHelper(this);
      this.Columns.unshift(cbHelper.setUpCheckBoxCell());
    }
    this.tableSettings.columns = _.map(this.Columns, (setting) => { return new HandleColumnSettings(setting, this).getDataTablesColumns(); });
  }

  private initFooterSettings(){
    if(this.FooterSettings){
      let footerSettingsHelper = new FooterSettingsHelper(this);
    }
  }

  ngOnInit() {
  }

}

