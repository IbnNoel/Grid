import {ActionButton, ActionMenuComponent} from "../../action-menu/action-menu.component";
import {ComponentFactoryResolver, ComponentRef, ViewContainerRef} from "@angular/core";
import { DataTableComponent } from '../data-table.component';
import { RenderedResponsiveCollapsedHelper } from './CollapsedResponsive';

export class HandleColumnSettings {

  private colSettings: DataTables.ColumnSettings = {
    orderable: false
  };
  columnDefinition:ColumnDefs;
  isCollapsedOnRender: boolean;
  renderedResponseCollapsedHelper: RenderedResponsiveCollapsedHelper;

  constructor(setting: ColumnDefs, dtComponent: DataTableComponent) {
    this.colSettings.className = "key_" + setting.key;
    this.colSettings.title = setting.key;
    this.columnDefinition = setting;
    this.renderedResponseCollapsedHelper = dtComponent.renderedResponsiveCollapsedHelper;

    Object.entries(setting).forEach(([key, value]) => {
      if (value && this[key + "_Func"])
        this[key + "_Func"](value)
    });

    this.isCollapsedOnRender = dtComponent.CollapseOnRender;
    this.setCollapseRenderSettings();
  }

  setCollapseRenderSettings(){
    if(this.isCollapsedOnRender){
      if(this.columnDefinition.breakpoint){
        this.colSettings.className += " " + this.columnDefinition.breakpoint;
      }else{
        this.colSettings.className += " min-narrowDesktop";
        if(this.columnDefinition.responsivePriority){
          this.renderedResponseCollapsedHelper.isResponsivePriortySet = true;
          this.colSettings.className += " max-desktop";
        }
      }
    }
  }

  getDataTablesColumns() {
    return this.colSettings;
  }

  header_Func(header: string) {
    this.colSettings.className += " head_" + header.replace(" ", "_");
    this.colSettings.className = this.colSettings.className.replace("/", "_");
    this.colSettings.title = header;
  }

  key_Func(key: string) {
    this.colSettings.name = key;
    this.colSettings.data = key;
  }

  className_Func(className: string) {
    this.colSettings.className += " " + className;
  }

  cellElement_Func(func: FunctionCellElement) {
    this.colSettings.defaultContent = "";
    this.colSettings.createdCell = (cell, cellData, rowData, row, col) => {

      var elementValue = func(cellData, rowData, row, col);
      if (elementValue instanceof GPFIButton) {
        var button = elementValue as GPFIButton;
        button.Html.click(rowData, (e) => {
          button.OnClick(rowData, row);
        });
        $(cell).append(elementValue.Html);
      } else if (elementValue instanceof ActionMenuComponent) {
        /*let componentFactory = this.componentFactory.resolveComponentFactory(ActionMenuComponent);
        let componentRef: ComponentRef<ActionMenuComponent> = this._viewContainerRef.createComponent(componentFactory);
        componentRef.instance.buttons = elementValue.buttons;
        $(cell).append(componentRef.location.nativeElement);*/
      }
    };
    this.colSettings.className += " gpfi_tbl_customCell";
  }

  default_Func() {
  }

  translate_Func() {
  }

  formatter_Func(func: (any) => string) {
    this.colSettings.render = func;
  }

  type_Func() {
  }

  sortable_Func() {
  }
  collapseGrid_Func() {
  }
  width_Func() {
  }
  hideCollapsed_Func() {
  }
  detailColumn_Func() {
  }
  calculateTotal_Func() {
    // totalCalculateColumns[colElement.key] = "";
  }
}


// TODO:- Add description to each property

export interface ColumnDefs {
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
  calculateTotal?: boolean;
  /**
   * The Default text which will appear in the column cell
   */
  default?: string;
  /**
   * A callback used to create dynamic data for the cell. //TODO:- add more information and describe return function
   */
  cellElement?: FunctionCellElement | HTMLElement | GPFIButton | ActionMenuComponent;

  translate?: boolean;
  formatter?: DataTables.FunctionColumnRender;
  /** TODO:- Create an Enum for this type */
  type?: any;
  sortable?: string;
  collapseGrid?: string;
  width?: number;
  hideCollapsed?: boolean;
  detailColumn?: any;
  /* 
  * Used to determine which columns should remain on screen when grid collapses in responsive mode.
  */
  responsivePriority?:boolean;
  /*
  * TODO:- Set up enum of break points
  * Manully set the breakpoint at which the column should be view on screen !
  */
  breakpoint?: string;

}

type FunctionCellElement = (cellData?: any, rowData?: any, row?: number, col?: number) => HTMLButtonElement | HTMLElement | GPFIButton | ActionMenuComponent | string;

export class GPFIButton {
  private html: JQuery<HTMLElement>;
  private onClick: any;

  constructor(name, onClick, cssClass?) {
    let classes = cssClass || "btn-default";
    this.html = $(`<button class="btn  ${classes}"> ${name} </button>`);
    this.onClick = onClick;
  }

  get Html() {
    return this.html;
  }

  OnClick(rowData,row) {
    return this.onClick(rowData, row);
  }

}
/*export class DataGridActionButton{
  private html: JQuery<HTMLElement>;
  private onClick: any;
  private buttons:Array<ActionButton>=[];
  btnHtml =
    '<div class="btn-group">' +
    '<button class="btn btn-primary dropdown-toggle gpfiActionBtn" data-toggle="dropdown" aria-expanded="false">' +
    '<span class="caret"></span>' +
    '</button>' +
    ' <ul class="dropdown-menu dropdown-menu-right">' + '</ul>' +
    '</div>';
  constructor(name, onClick, buttons,cssClass?) {
    let classes = cssClass || "btn-default";
    this.html = $(this.btnHtml);
    this.onClick = onClick;
    this.buttons=buttons;
  }
   jqBtn = $(this.btnHtml);
 test(){
this.buttons.forEach(function () {

})
  }
  for ( i = 0; i < this.buttons.length; i++) {
  var link = $("<a>" + btns[i].name + "</a>");
  var li = $("<li></li>");
  var btnFunc = new btnClick(btns[i].onClick, cellData, td, row);
  link.click(btnFunc);
  li.append(link);
  jqBtn.find(".dropdown-menu").append(li);
}

function btnClick(btnClickFunc, data, td, row) {
  var func = btnClickFunc;
  var _data = data, _td = td, _row = row;
  return function () {
    func(_data, _td, _row);
  }
}

return jqBtn;

  get Html() {
    return this.html;
  }

  OnClick(rowData) {
    return this.onClick(rowData);
  }
}*/

