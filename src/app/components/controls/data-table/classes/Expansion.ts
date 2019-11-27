import * as $ from 'jquery';
import * as _ from 'lodash';
import { Observable, timer, AsyncSubject } from 'rxjs';
import { DataTableComponent } from '../data-table.component';
import { ViewContainerRef, QueryList, ElementRef, ComponentRef } from '@angular/core';

export class ExpansionSettingsHandler{
    private _tableApi :  DataTables.Api;
    private _expansionSettings : ExpansionSettings;
    private _expandCallback : any;
    private _responsiveColsDisplayedInExpansion: Map<number,any> = new Map();
    private _componentMap: Map<number,ComponentRef<any>> = new Map();
    private _viewContainer: ViewContainerRef;

    constructor(){ }

    init(dtComponent: DataTableComponent) {
        this._expansionSettings = dtComponent.ExpansionSettings;
        this._viewContainer = dtComponent.VCR;
        dtComponent.onGridInit$.subscribe((param) => {
            if(param){
                this._tableApi = param.api;
                this._tableApi.on('draw',(apiParam) => {
                    this.onGridRender(param.tableDom);
                });
            }
        })
    }

    expandGrid(rowInfo : DataTables.RowMethods):void {
        this._expansionSettings.DetailRowCallback(this._viewContainer, rowInfo.data(), rowInfo).then((expansionHtml) => {
            let html: any = expansionHtml;
            if(expansionHtml instanceof ComponentRef){
                this._componentMap.set(rowInfo.index(),expansionHtml);
                html = expansionHtml.location.nativeElement;
            }
            this.renderDetailHtml(rowInfo,html);
        });
    }

    showDetailExpansionBtn(rowData: any){
        if(this._expansionSettings && this._expansionSettings.getShowExpandedCallback()){
            return this._expansionSettings.getShowExpandedCallback()(rowData);
        }else{
            return true;
        }
    }

    private renderDetailHtml(row: DataTables.RowMethods, detailHtml){
        let holder = $("<div class='detailHolder'></div>");
        let inlineCols = $("<div class='gpfiInlineCols'></div>");
        let tr = $(row.node());

        let collapsedColumnHtml = this._responsiveColsDisplayedInExpansion.get(row.index());
         if (collapsedColumnHtml) {
            inlineCols.append(collapsedColumnHtml);
            this._responsiveColsDisplayedInExpansion.delete(row.index());
        }
        holder.append(inlineCols);
        holder.append($("<div class='gpfi-detail-html'></div>").append(detailHtml));
        row.child(holder).show();

        tr.next().addClass("child");
        tr.next().find('td').attr("colspan", "100%");
    }

    collapseGrid(rowInfo: DataTables.RowMethods){
        var rowIndex = rowInfo.index();

        if(this._componentMap.get(rowIndex)){
            this._componentMap.get(rowIndex).destroy();
            this._componentMap.delete(rowIndex);
        }
        rowInfo.child.hide();
    }

    set expandCallback(callback){
        this._expandCallback = callback;
    }

    /*
    * Dom is saved to a dictionary to be appended when a custom expansion is invoked
    */
    setResponsiveExpansiveColsDisplayed(rowIndex,columnTable){
        this._responsiveColsDisplayedInExpansion.set(rowIndex,columnTable);
    }

    onGridRender(tableDom){
        $(tableDom.tHead).find("tr th").each((index,ele) => {
            if ($(ele).attr("class")) {
                $(tableDom.tBodies[0]).find(".head_" + this.getClassNameByPrefix(ele, "head")).attr('data-title', $(ele).html());
            }
        });
    }

    getDataTableRowObject(rowInfo){
        let row: DataTables.RowMethods;

        if("propertyName" in rowInfo){
            row = this._tableApi.row(function (idx, data, node) {
                return data[(rowInfo as any).propertyName] == rowInfo.id;
            })
        }else{
            row = rowInfo as DataTables.RowMethods;
        }
        return row;
    }

    private getClassNameByPrefix(dom, prefix) {
        var keyClass = $(dom).attr("class").split(" ").filter(function (str, i) {
            return str.substring(0, prefix.length) == prefix;
        });
        if (keyClass.length > 0) {
            var keyString = keyClass[0].substring(prefix.length + 1);
            keyString = this.addSlashToDot(keyString);
            return keyString;
        } else {
            return null;
        }
    }

    /**
     * TODO: extract into a different helper class
     */
    addSlashToDot(keyString) {
        var dotIndex = keyString.indexOf('.');
        if (dotIndex > -1) {
            keyString = keyString.slice(0, dotIndex) + "\\" + keyString.slice(dotIndex);
        }
        return keyString;
    }
}

export class ExpansionSettings{
    private handler : ExpansionSettingsHandler;
    private _detailRow : boolean;
    private _showExpandedCallback: (rowData : any) => boolean;
    /**
     * This function event is invoked when a grid is expanded, which is best used with detail row grid
     */
    private _detailRowCallback: (detailHolder: ViewContainerRef, rowData, row?: DataTables.RowMethods) => Promise<string | ComponentRef<any>>;

    /*
    * @isDetailRow 
    *
    * 
    */
    constructor(isDetailRow?: boolean, detailRowCallback?: (detailHolder: ViewContainerRef, rowData, row?: DataTables.RowMethods) => Promise<string | ComponentRef<any>>){
        this._detailRowCallback = detailRowCallback;
        this._detailRow = isDetailRow;
    }

    /*
    * This callaback is invoked on creation of each rows expansion button, if true returned expansion button is displayed,
    *  if false returned expansion button is hidden;
    */
    setShowExpandedCallback(callback: (rowData : any) => boolean){   
        this._showExpandedCallback = callback;
    }

    getShowExpandedCallback(){
        return this._showExpandedCallback;
    }

    expandGrid(rowInfo: {id: number, propertyName: string} | DataTables.RowMethods){
        let row = this.handler.getDataTableRowObject(rowInfo);
        if (row.length > 0) {
            if (this.noExpansionBtn(row)) {
                this.handler.expandGrid(row);
            } else {
                $(row.node()).find(".gpfiExpand.collapsed").click();
            }
        }
    }
    /**
     * Add new overloaded params
     * @param row 
     */
    collapseGrid(rowInfo?: {id: number, propertyName: string} | DataTables.RowMethods){
        let row = this.handler.getDataTableRowObject(rowInfo);
        if (this.noExpansionBtn(row)) {
            this.handler.collapseGrid(row);
        }else{
            $(row.node()).find(".gpfiExpand:not(.collapsed)").click();
        }
    }

    private noExpansionBtn(row){
        return $(row.node()).find(".gpfiExpand").length == 0;
    }
    
    get DetailRowCallback(){
        return this._detailRowCallback;
    }

    /**
     * This accessor is used specifically for internal use.
     * 
     */
    set _expansionSettingHandler(handler: ExpansionSettingsHandler){
        this.handler = handler;
    }

    get _isDetailRow(){
        return this._detailRow;
    }
}