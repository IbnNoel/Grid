import * as $ from 'jquery';
import * as _ from 'lodash';
import { Observable, timer, AsyncSubject } from 'rxjs';
import { DataTableComponent } from '../data-table.component';
import { ExpansionSettingsHandler, ExpansionSettings } from './Expansion';

 /*
 * Expansion can be achieved via td, objectId or DATA!
 */
 export class RenderedResponsiveCollapsedHelper{
    private _dataTableSettings: DataTables.Settings;
    private _numberOfColumns:number;
    private _isDetailRowEnabled:boolean;
    private _expandHelper: ExpansionSettingsHandler;
    private _dataTableApi: DataTables.Api;
    private _dataTableHtml: any;
    private _responsivePriorty: boolean;
    private _rowRenderedMap = new Map<number, AsyncSubject<any>>();
    private _expansionSettings: ExpansionSettings;

    constructor(){}

    set isResponsivePriortySet(value: boolean){
        this._responsivePriorty = value;
    }

    get isResponsivePriortySet(){
        return this._responsivePriorty;
    }

    init(dtComponent: DataTableComponent){
        dtComponent.onGridInit$.subscribe((param) => {
            if(param){
                $(param.tableDom).removeClass("responsive-vertical");
                this._dataTableApi = param.api;
            }
        });

        this._dataTableHtml = dtComponent.tableHtml;
        this._dataTableSettings = dtComponent.tableSettings;
        this._expansionSettings = dtComponent.ExpansionSettings;
        this._isDetailRowEnabled = (!!dtComponent.ExpansionSettings) ? dtComponent.ExpansionSettings._isDetailRow : false;
        this._expandHelper = dtComponent.expansionSettingsHandler;
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
                defaultContent: "",
                createdCell: (td, cellData, dataRow) => {
                    let expandBtn = $('<button class="btn btn-box-tool down-arrow collapsed gpfiExpand" type="button" aria-expanded="false"> </button>');

                    let detailEnabled = this._expandHelper.showDetailExpansionBtn(dataRow);
                    let tr = $(td).closest('tr');

                    if (this._isDetailRowEnabled && !detailEnabled) {
                        expandBtn.addClass('gpfiGridNoDetail');
                        $(td).removeClass("max-desktop").addClass("control");
                        tr.attr("detailEnabled", String(detailEnabled));
                    }
                    $(td).html("").append(expandBtn);
                    $(td).click({td: td, detailEnabled: detailEnabled, tr: tr}, (e) => {
                        let apiRow = this._dataTableApi.row(e.data.tr);

                        let isClosed = $(e.data.td).find("button").hasClass("collapsed");
                        $(e.data.td).find('button').toggleClass('collapsed');
                        e.data.tr.toggleClass('shown');

                        if(this._isDetailRowEnabled || detailEnabled){
                            if(isClosed){
                                this.handleAsnycHiddenColRender(() => { this._expandHelper.expandGrid(apiRow) },apiRow.index());
                            } else {
                                this._expandHelper.collapseGrid(apiRow);
                            }
                        }
                    }) ;
                }
            }
        );
        if(! this._responsivePriorty){
            var columnNumber = 4;
            for (var i = 1; i < columnNumber; i++) {
                this._dataTableSettings.columns[i].className.replace('min-desktop', '');
                this._dataTableSettings.columns[i].className += " max-desktop";
            }
        }
    }

    /**
     * If table collapsed the hidden columns need to be rendered before the expansion or collapse row functionaility can take place
     */
    private handleAsnycHiddenColRender(func : () => void, index){
        if($(this._dataTableHtml.nativeElement).hasClass("collapsed")){
            let sub = new AsyncSubject();
            sub.subscribe(func);
            this._rowRenderedMap.set(index, sub);
        }else{
            func();
        }
    }

    onExpandedColumnRender = (tableApi, rowIndex, rowColumns) => {
        this._numberOfColumns = 0;
        var index = rowIndex[0];

        let isClosed = $(tableApi.row(index).node()).find(".gpfiExpand").hasClass("collapsed");
        if(isClosed){
            return false;
        }
        let responsiveCellRows = this.constructExcessColumnsHolder(tableApi, index, rowColumns);
        let columnTable = $("<table class='detailItems table tblBreakWords'/>").append(responsiveCellRows);
        let currentRow =  $(tableApi.row(index).node());

        // if the table or row does'nt have detail row capability
        if (!this._expansionSettings  || currentRow.attr("detailenabled") == "false") {
            // if no columns are hidden
            if (columnTable.find('tr').length == 0) {
                return false;
            }
            return columnTable;
        }

        this._expandHelper.setResponsiveExpansiveColsDisplayed(index, columnTable);

        let expandedRow = currentRow.next();
        if (this.isRowExpanded(currentRow,expandedRow)) {
            $(expandedRow.find("td")[0]).attr("colspan", this._numberOfColumns);
            var gpfiInlineEl = expandedRow.find(".gpfiInlineCols");
            if (gpfiInlineEl.length > 0) {
                $(gpfiInlineEl[0]).html("").append(columnTable);
            }
        }else{
            var expansionFunc = this._rowRenderedMap.get(index);
            if(expansionFunc){
                expansionFunc.next(this._rowRenderedMap.delete(index));
                expansionFunc.complete();
            }
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

        // an additional cell is added to the columns to consider the dynamic expansion btn, which appears in expansion!
        /*if(!this._isDetailRowEnabled){
            rowColumns.unshift({expanCell : true});
        }*/
        let renderedColHolder = $.map(rowColumns, (col) => {
            let columnIdx = col.columnIndex;
            // is this column the one that contains the expansion button?
            let isExpansionCol = $(tableApi.column(columnIdx).header()).hasClass("control");
            // has the custom 'hide collapsed' class been assigned to this column from outside of dataTable
            let isColHiddenInExpandedRow = $(tableApi.cell(rowIndex,columnIdx).node()).hasClass("hideCollapsed");

            if ((col.hidden || !tableApi.column(columnIdx).visible()) && !isExpansionCol && !isColHiddenInExpandedRow){
                // check that row does not belong to excluded list of columns specified in column definition
                let excludedColumns = this.getExcludedColumns();

                // TODO:- Refactor !
                if (excludedColumns.length > 0) {
                    let excludedColsMatch = $.grep(excludedColumns, function (n) {
                        return n.key === excludedColsMatch.column(columnIdx).dataSrc();
                    });
                    if (excludedColsMatch.length > 0) {
                        return null;
                    }
                }
                // get any cells including custom sells such as html elements.
                let customCellHtml = jQuery(tableApi.cells(rowIndex, columnIdx).nodes()).children();

                let reRenderedControl = this.invokeControlResponsiveEvent(customCellHtml, tableApi.row(rowIndex).data());
                let cellHtml = (customCellHtml.length > 0) ? reRenderedControl || customCellHtml.clone(true, true) : col.data;

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
        let hiddenColumnHolder = $(`<tr data-dtr-index="${columnIndexStr}" data-dt-row="${String(rowIndex)}" data-dt-column="${columnIndexStr}">
            <td class="dtr-title">${column.title}</td>
        </tr>`);
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
