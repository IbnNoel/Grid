import { DataTableComponent } from '../data-table.component';


export class CheckBox{

    private _onChange:(row, isChecked:boolean) => void;
    private _displayCheckBoxCallback:any;


    constructor(onChange:(row, isChecked:boolean) => void){
        this._onChange = onChange;
    }

    setDisplayCheckBoxCallback(callback){
        this._displayCheckBoxCallback = callback;
    }

    getDisplayCheckBoxCallback(){
        return this._displayCheckBoxCallback;
    }

    getOnChangeCallback(){
        return this._onChange;
    }
}

export class CheckBoxHelper {
    private _colSettings:DataTables.ColumnSettings;
    private _checkBox: CheckBox;

    constructor(){}

    init(dt:DataTableComponent){
        //this._checkBox;
    }

    setUpCheckBoxCell(){
        return {
            className:"checkBoxCol hidden-print", cellElement:function(td,cellData,row){
                let checkBox = $("<input type='checkbox'/>");
                checkBox.addClass("chkbox");
                let displayCboxCallback = this._checkBox.getDisplayCheckBoxCallback();
                let onChangeCallback = this._checkBox.displayCboxCallback();

                if(displayCboxCallback(row, checkBox) === false){
                    return;
                }

                checkBox.change(function (e, param) {
                    let isChecked = false;
                    /*if (param) {
                        this.checked = param.parent;
                    }*/
                    onChangeCallback(row, isChecked);
                });
                $(td).append(checkBox);

        }, responsivePriority: true};
    }
    

}