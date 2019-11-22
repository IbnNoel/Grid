import * as $ from 'jquery';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { DataTableComponent } from '../data-table.component';

/*
    detailRow: '=',
    hideExpandBtn: '=',
    detailRowCallback: '&',
    showExpanded: '&',
    // tells the grid to collapse in rendered mode !!!!
    collapseGrid: '=',

*/

/**
 * TODO:- 
 * distinguish the difference between collapse grid and detail row
 * collapse grid renders the grid collapsed in responsive view
 * Detail row shows an expansion button that enables the row to be expanded!
 * 
 */

 /*
 * Expansion can be achieved via td, objectId or DATA!
 */

 export class RenderedResponsiveCollapsedHelper{
     _dataTableSettings: DataTables.Settings;
     _numberOfColumns:number;
     _isDetailRowEnabled:boolean;
     _expandHelper: ExpansionSettingsHandler;
     _dataTableApi: DataTables.Api;

     private _responsivePriorty: boolean;

    constructor(){

    }

    set isResponsivePriortySet(value: boolean){
        this._responsivePriorty = value;
    }

    get isResponsivePriortySet(){
        return this._responsivePriorty;
    }

    setupExpansionSettings(dataTableSettings: DataTables.Settings, expandHelper: ExpansionSettingsHandler, onGridInit$: Observable<{api:DataTables.Api, tableDom:any}>){

        onGridInit$.subscribe((param) => {
            if(param){
                $(param.tableDom).removeClass("responsive-vertical");
                this._dataTableApi = param.api;
            }
        });
        /**
         * TODO:- Refactor!
         */
        this._dataTableSettings = dataTableSettings;
        this._isDetailRowEnabled = !!expandHelper;
        this._expandHelper = expandHelper;

        this._dataTableSettings.dom = (this._dataTableSettings.paging) ? "<'container-fluid'<'row gpfiPageLengthControl' <'clearfix'> l><'row't><'row'p>>" : "<'container-fluid'<'row't>>";
        this._dataTableSettings.responsive = {
            details: {
                type: 'column',
                target: 0,
                renderer: this.onExpandedColumnRender
            },
            breakpoints:this.setResponsiveBreakPoints()
        }
        this.addExpansionColBtn();
    }

    private addExpansionColBtn(){
        //"className": ((!$scope.detailRow) ? "control" : "max-desktop" ) + " gpfiExpansionCol" + (!!$scope.hideExpandBtn ? " hideColumn" : ""),
        this._dataTableSettings.columns.unshift(
            {
                "name": null,
                "data": null,
                "className": ((!this._isDetailRowEnabled ) ? "control" : "max-desktop" ) + " gpfiExpansionCol",
                "orderable": false,
                //sortable: false,
                defaultContent: "",
                //"responsivePriority": 1,
                createdCell: (td, cellData, dataRow) => {
                    let expandBtn = $('<button class="btn btn-box-tool down-arrow collapsed gpfiExpand" type="button" aria-expanded="false"> </button>');
                    //TODO:- Get detailColMeta from expansion holder
                    //var detailEnabled = (detailColMeta != null) ? detailColMeta(td, dataRow) : true;
                    let detailEnabled = true;
                    let tr = $(td).closest('tr');
                    let row = this._dataTableApi.row(tr);                    
                    
                    if (this._isDetailRowEnabled && !detailEnabled) {
                        expandBtn.addClass('gpfiGridNoDetail');
                        $(td).removeClass("max-desktop").addClass("control");
                        tr.attr("detailEnabled", String(detailEnabled));
                    }

                    // if (!!$scope.hideExpandBtn) {
                    //     expandBtn.hide();
                    // }

                    $(td).html("").append(expandBtn);
                    $(td).click({td: td, detailEnabled: detailEnabled, tr: tr}, function(e){
                        let isClosed = $(this).find("button").hasClass("collapsed");
                        if(isClosed){
                            // expand Grid
                        } else {
                            // collapse Grid
                        }
                        $(this).find('button').toggleClass('collapsed');
                        //expandGrid(e)
                    }) ;
                }
            }
        );
        if(!this._responsivePriorty){
            var columnNumber = 4;
            for (var i = 1; i < columnNumber; i++) {
                this._dataTableSettings.columns[i].className.replace('min-desktop', '');
                this._dataTableSettings.columns[i].className += " max-desktop";
            }
        }
    }

    private onExpandedColumnRender(tableApi, rowIndex, rowColumns){
        this._numberOfColumns = 0;
        let responsiveCellRows = this.constructExcessColumnsHolder(tableApi, rowIndex, rowColumns);
        let columnTable = $("<table class='detailItems table tblBreakWords'/>").append(responsiveCellRows);
        let currentRow =  $(tableApi.row(rowIndex).node());

        // if the table or row does'nt have detail row capability 
        if (!this._isDetailRowEnabled || currentRow.attr("detailenabled") == "false") {
            // if no columns are hidden
            if (columnTable.find('tr').length == 0) {
                return false;
            }
            return columnTable;
        }
        
        this._expandHelper.setResponsiveExpansiveColsDisplayed(rowIndex, columnTable);

        let expandedRow = currentRow.next();
        if (this.isRowExpanded(currentRow,expandedRow)) {
            $(expandedRow.find("td")[0]).attr("colspan", this._numberOfColumns);
            var gpfiInlineEl = expandedRow.find(".gpfiInlineCols");
            if (gpfiInlineEl.length > 0) {
                $(gpfiInlineEl[0]).html("").append(columnTable);
            }
        }else{
            return false;
        }
    }

    private isRowExpanded(currentRow, expandedRow){
        return currentRow.hasClass("shown") && expandedRow.hasClass("child");
    }

    /*
     * THIS CODE ADDS THE COLUMNS THAT ARE HIDDEN WHEN RESPONSIVE TO A
     * SUB TABLE THAT IS DISPLAYED ON AN GRID EXPANSION!!!!!
     */
    private constructExcessColumnsHolder(tableApi, rowIndex, rowColumns){
        let renderedColHolder = $.map(rowColumns, (col, columnIdx) => {
            // is this column the one that contains the expansion button?
            let isExpansionCol = $(tableApi.column(columnIdx).header()).hasClass("control");
            // has the custom 'hide collapsed' class been assigned to this column from outside of dataTable 
            let isColHiddenInExpandedRow = $(tableApi.cell(rowIndex,columnIdx).node()).hasClass("hideCollapsed");

            if ((col.hidden || !tableApi.column(columnIdx).visible()) && !isExpansionCol && !isColHiddenInExpandedRow){

                // check that row does not belong to excluded list of columns specified in column definition
                let excludedColumns = this.getExcludedColumns();

                if (excludedColumns.length > 0) {
                    // TODO:- Refactor !
                    let excludedColsMatch = $.grep(excludedColumns, function (n) {
                        return n.key === excludedColsMatch.column(columnIdx).dataSrc();
                    });
                    if (excludedColsMatch.length > 0) {
                        return null;
                    }
                }
                
                // get any cells including custom sells such as html elements.
                let customCellHtml = $(tableApi.cells(rowIndex, columnIdx).nodes()).children();

                let reRenderedControl = this.invokeControlResponsiveEvent(customCellHtml, tableApi.row(rowIndex).data());

                let cellHtml = (customCellHtml.length > 0) ? reRenderedControl || customCellHtml.clone(true,true) : col.data;

                // build the html to hold the hidden columns!
                return this.buildColumnContainerHtml(columnIdx, rowIndex, col, cellHtml);
            }else {
                this._numberOfColumns ++;
            }
        });
        return renderedColHolder;
    }

    private buildColumnContainerHtml(columnIndex, rowIndex, column, cellHtml){
        let columnIndexStr = String(columnIndex);
        let hiddenColumnHolder = `<tr data-dtr-index="${columnIndexStr}" data-dt-row="${String(rowIndex)}" data-dt-column="${columnIndexStr}">
            <td class="dtr-title">${column.title}</td>
        </tr>`;
        $(hiddenColumnHolder).append($('<td class="gpfi_tbl_childVal"></td>').append(cellHtml));

        return $(hiddenColumnHolder);
    }

    private getExcludedColumns(){
        return [];
    }

    private invokeControlResponsiveEvent(columnCell, rowData ){
        //invokeEvent("onControlRespReRender", {control: columnCell, row: rowData});
        return null;
    }

    private setResponsiveBreakPoints(){
        return [
            {name:'desktop',width:Infinity},
            {name:'wideDesktop',width:1500},
            {name:'narrowDesktop', width: 1300}, //1300< >1024
            {name:'tablet', width: 1024},
            {name:'iphoneFive',width:350},
            {name:'mobile',width:320}
        ]
    }


 }


export class ExpansionSettingsHandler{
    private _tableApi :  DataTables.Api;
    private _expansionSettings : ExpansionSettings;
    private _expandCallback : any;
    private _responsiveColsDisplayedInExpansion: Map<number,any>;

    constructor(){

    }

    init(dtComponent: DataTableComponent){
        this._expansionSettings = dtComponent.ExpansionSettings;
        //this._tableApi = dataTableApi;
    }

    expandGrid(rowInfo?:{id: number, propertyName: string}, tableRow?: DataTables.RowMethods):void{
        let row = tableRow;
        if(rowInfo){
            row = this._tableApi.row(function (idx, data, node) {
                return data[rowInfo.propertyName] == rowInfo.id;
            }); 
        }
        //TODO: Refactor
        let tr = $(row.node());
        let td = tr.children[0];

        this.renderDetailHtml(row, this._expansionSettings.DetailRowCallback(td,row.data));
    }

    private renderDetailHtml(row: DataTables.RowMethods, detailHtml){
        let holder = $("<div class='detailHolder'></div>");
        let inlineCols = $("<div class='gpfiInlineCols'></div>");
        let tr = $(row.node());

        let collapsedColumnHtml = this._responsiveColsDisplayedInExpansion.get(row.index());

        if (collapsedColumnHtml) {
            inlineCols.append(collapsedColumnHtml);
        }
        holder.append(inlineCols);
        holder.append($("<div class='gpfi-detail-html'></div>").append(detailHtml));
        row.child(holder).show();

        /*var scope = angular.element(detailHtml).scope();
        if (scope != null) {
            row.child().childScope = scope;
        }*/

        tr.next().addClass("child");
        tr.next().find('td').attr("colspan", "100%");

        /*if ($scope.noInlineClass) {
            holder.closest(".dataTables_wrapper").removeClass("form-inline");
        }*/
        /*reAdjustScrollable();
        invokeEvent("onDetailShown", row);*/
    }

   

    collapseGrid(){
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

    
}

export class ExpansionSettings{

    private handler : ExpansionSettingsHandler;
    private _detailRow : boolean;
    /**
     * This function event is invoked when a grid is expanded, which is best used with detail row grid
     */
    private _detailRowCallback: (detailHolder,rowData) => any;

    /*
    * @isDetailRow 
    *
    * 
    */

    constructor(isDetailRow?: boolean, detailRowCallback?: (detailHolder,rowData) => void){
        this._detailRowCallback = detailRowCallback;
        this._detailRow = isDetailRow;
    }

    

    setShowExpandedCallback(callback: (rowData : any) => boolean){
        
    }

    expandGrid(id, propName: string){
        this.handler.expandGrid(id, propName);
    }

    collapseGrid(){
        //this.handler.expandGrid();
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