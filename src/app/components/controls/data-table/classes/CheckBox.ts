import { DataTableComponent } from '../data-table.component';
import { ColumnDefs } from './Columns';
import * as _ from 'lodash';

export class CheckBoxSettings{

    private _onChange:(row, isChecked:boolean) => void;
    private _displayCellBox: (row, checkBox:any) => boolean;
    private _onHeaderRenderCallback: () => boolean;

    constructor(onChange:(row, isChecked:boolean) => void, displayCellBox?: (row, checkBox:any) => boolean){
        this._onChange = onChange;
        this._displayCellBox = displayCellBox;
    }

    setDisplayCheckBoxCallback(callback){
        this._displayCellBox = callback;
    }

    get HeaderRenderCallback(){
        return this._onHeaderRenderCallback;
    }

    set HeaderRenderCallback(callback){
        this._onHeaderRenderCallback = callback;
    }

    getDisplayCheckBoxCallback(){
        return this._displayCellBox;
    }

    getOnChangeCallback(){
        return this._onChange;
    }
}

export class CheckBoxHelper {
    private _colSettings: DataTables.ColumnSettings;
    private _checkBox: CheckBoxSettings;
    private _tableDom: any;
    private _columns:Array<ColumnDefs>;

    constructor(dtComponent:DataTableComponent){
        this._checkBox = dtComponent.CheckBoxSettings;
        this._columns = dtComponent.Columns;

        dtComponent.onGridInit$.subscribe(tableInfo => {
            if(tableInfo == null){
                return;
            }
            tableInfo.api.on('draw', (param) => {
                this.manageHeaderCheckBoxSelectDeselectHandler();
            });
            this._tableDom = tableInfo.tableDom;
            this.setUpCheckBoxHeader();
        });
    }

    manageHeaderCheckBoxSelectDeselectHandler(){
        var allCheckBoxes = $(this._tableDom).find(".chkbox");
        allCheckBoxes.click(()=>{
            let headCb = $(this._tableDom).find("#itemGridParentCbox");
            let allChecked = _.every(allCheckBoxes, ['checked', true]);
            if(allChecked){
                headCb.prop("checked", true);
            }else{
                headCb.prop( "checked", false);
            }
        });
    }

    setUpCheckBoxHeader(){
        var oldHeaderCheckBox = $(this._tableDom).find("#itemGridParentCbox");
        if (oldHeaderCheckBox) {
            oldHeaderCheckBox.remove();
        }

        var headerCheckBox = $("<input id='itemGridParentCbox' type='checkbox'/>");
        headerCheckBox.change((e) => {
            let isChecked = (e.currentTarget as any ).checked;
            var allCheckBoxes = $(this._tableDom).find(".chkbox");
            allCheckBoxes.trigger("change", {parent:isChecked});
        });
        let callback = this._checkBox.HeaderRenderCallback;
        if(callback != null && callback() === false){
            return;
        }
        $(this._tableDom).find("th.checkBoxCol").append(headerCheckBox);
        /*jQuery.each($(this._tableDom).find("tr"), function (index, row) {
            $(row).prepend($(row).find(".checkBoxCol")[0])
        });*/
    }

    setUpCheckBoxCell(): ColumnDefs{
        return {
            className:"checkBoxCol hidden-print", 
            cellElement: (cellData, rowData, row, col, td) => {
                let checkBox = $("<input type='checkbox'/>");
                checkBox.addClass("chkbox");
                let displayCboxCallback = this._checkBox.getDisplayCheckBoxCallback();
                let onChangeCallback = this._checkBox.getOnChangeCallback();

                if(displayCboxCallback != null && displayCboxCallback(row, checkBox) === false){
                    return;
                }

                checkBox.change(function (e, param) {
                    let isChecked = (e.currentTarget as any ).checked;
                    if (param) {
                        isChecked = param.parent;
                        (e.currentTarget as any ).checked = isChecked;
                    }
                    onChangeCallback(row, isChecked);
                });
                $(td).append(checkBox);
        }, responsivePriority: !!_.find(this._columns,{'responsivePriority': true})};
    }
}