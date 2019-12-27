import { DataTableComponent } from '../data-table.component';
import * as $ from 'jquery';

export class GeneralSettings{
    _generalSettingHelper: GeneralSettingsHelper;
    constructor(){

    }
    AddRow(){}
    UpddateRow(rowInfo, record){
        this._generalSettingHelper.UpdateRow(rowInfo, record);
    }
    DeleteRow(rowInfo){
        this._generalSettingHelper.DeleteRow(rowInfo);
    }
    SetUpOnGridInit(){}

    set GeneralSettings(settings){
        this._generalSettingHelper = settings;
    }

}

export class GeneralSettingsHelper{

    _tableApi:DataTables.Api;
    _colDef:DataTables.ColumnSettings;
    _tableSettings:DataTables.Settings;
    _isDetailRow:boolean;

    constructor(dtComponent:DataTableComponent){
        this._colDef = dtComponent.columnSettings;
        this._tableSettings = dtComponent.tableSettings;
        this._isDetailRow = (!!dtComponent.ExpansionSettings) ? dtComponent.ExpansionSettings._isDetailRow : false;

        dtComponent.onGridInit$.subscribe((param) => {
            if(param){
                this._tableApi = param.api;
            }
        });
    }

    UpdateRow(rowInfo: {id, propertyName: string} | DataTables.RowMethods | number, record){
        let tableRecord = GeneralSettingsHelper.getDataTableRowObject(rowInfo, this._tableApi);

        if (tableRecord.data() == null) {
            //this._tableApi.row(this._tableApi.row.add(record).draw().node());
        }else{
            let typeCells =[];
            let colDef = this._colDef;
            let openActionCols = this.handleOpenActionBtn(tableRecord);
            let expansionCell = jQuery(tableRecord.node()).find(".gpfiExpansionCol").children().clone(true,true);
            // updates row with updated record.
            tableRecord.data(record);
            // replace previous expansion cell
            $(tableRecord.node()).find(".gpfiExpansionCol").html("").append(expansionCell as any);

            //update custom cells
            $(tableRecord.node()).find("[class*='type_'], .gpfi_tbl_customCell").each((index,cell) => {
                var tCell = this._tableApi.cell(cell);
                this._tableSettings.columns[tCell.index().column]
                .createdCell(cell, $(cell).text(), tableRecord.data(),0,0);
            });

            $(openActionCols).each(function(){
                this.find(".btn-group").addClass("open");
            });

            this.updateChildRows(tableRecord);

        }
    }

    DeleteRow(rowInfo: {id, propertyName: string} | DataTables.RowMethods | number){
        let tableRecord = GeneralSettingsHelper.getDataTableRowObject(rowInfo, this._tableApi);
        tableRecord.remove();
        this._tableApi.draw(false);
        // init page number refresh!
    }

    updateChildRows(tableRecord){
        (tableRecord as any).cells(tableRecord.index(), (tableRecord as any).columns()[0]).nodes().each((value, index) => {
            // Update child rows in detail row mode
                if (!$(value).is(":visible") && this._isDetailRow && tableRecord.child.isShown()) {
                    //Get child row isShown
                    var detailItemCell = $(tableRecord.child())
                        .find(".detailItems:first tr[data-dtr-index='" + index + "'] .gpfi_tbl_childVal");

                    var parentNode = $(this._tableApi.cell(value).node());
                    if (parentNode.children().length > 0) {
                        if(detailItemCell.children().length > 0 && detailItemCell.children().hasClass("open")){
                            parentNode.children().addClass("open");
                        }
                        detailItemCell.html("").append(parentNode.children().clone(true,true) as any);
                        return;
                    }
                    detailItemCell.html(parentNode.html());
                }
            });
    }

    handleOpenActionBtn(tableRecord){
        let openActionCols = [];
        $(tableRecord.node()).find("td .btn-group.open").each(function(){
            openActionCols.push($(this).parent());
        });
        return openActionCols;
    }

    static getDataTableRowObject(rowInfo, api){
        let row: DataTables.RowMethods;
        if(!isNaN(rowInfo)){
            row = api.row(rowInfo);
        }else if("propertyName" in rowInfo){
            row = api.row(function (idx, data, node) {
                return data[(rowInfo as any).propertyName] == rowInfo.id;
            })
        }else{
            row = rowInfo as DataTables.RowMethods;
        }
        return row;
    }

    static addSlashToDot(keyString) {
        var dotIndex = keyString.indexOf('.');
        if (dotIndex > -1) {
            keyString = keyString.slice(0, dotIndex) + "\\" + keyString.slice(dotIndex);
        }
        return keyString;
    }
}