import { DataTableComponent } from '../data-table.component';
import { GeneralSettingsHelper } from './General';

export class FooterSettings{
    _footerCallback: (totalCols: Map<string,number>, pageData:any, allColumns:any, collapsed:boolean) => HTMLElement | string;
    constructor(footerCallback:(totalCols: Map<string,number>, pageData:any, allColumns:any, collapsed:boolean) =>  HTMLElement | string){
        this._footerCallback = footerCallback;
    }

    get Callback(){
        return this._footerCallback;
    }
}

export class FooterSettingsHelper{
    _footerSettings: FooterSettings;
    _tableApi: DataTables.Api;
    _tableDom: any;

    constructor(dtComponent:DataTableComponent){
        this._footerSettings = dtComponent.FooterSettings;
        this._tableApi = dtComponent.dataTableApi;
        dtComponent.tableSettings.footerCallback = this.footCallbackFunc;

        dtComponent.onGridInit$.subscribe((param) => {
            if(param){
                this._tableDom = param.tableDom;
                this._tableApi = param.api;
            }
        });
    }

    setUpFooterCallback(tableDom){
        this._tableApi.on('responsive-resize', (e, datatable) => {
            //let footerCallback = this._footerSettings.Callback;
            var tfoot = $(tableDom).find("tfoot");
            if ($(tableDom).hasClass("collapsed")) {

                if (!tfoot.hasClass("tfootResponsive")) {
                    tfoot.addClass("tfootResponsive");
                    this.footCallbackFunc(null, datatable.data(), null, null,null);
                }
            } else {
                tfoot.removeClass("tfootResponsive");
                this.footCallbackFunc(null, datatable.data(), null, null,null);
            }
        });
    }

    footCallbackFunc =  (row, data, start, end, display) => {
        var api = this._tableApi;
        var rowTable = [];
        var totalCols: Map<string,number>;

        if(!this._tableApi){
            return
        }

        let cols = this._tableApi.settings().init().columns;

        $.each(cols , (ind, dat) => {
            var total = "";
            var visible = true;

            /*if (totalCalculateColumns[dat.name] != null) {
                total = api.column(dat.name + ':name')
                    .data()
                    .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                    }, 0);
                totalCols[dat.name] = total
            }*/

            if(dat.name != null) {
                visible = $(".key_" + GeneralSettingsHelper.addSlashToDot(dat.name)).is(":visible");
            }

            rowTable.push({name: dat.name, total: total, visible:visible});
        });

        let html = this._footerSettings.Callback(totalCols,data,rowTable,$(this._tableDom).hasClass("collapsed"));

        if (html != null){
            $(this._tableDom).find("tfoot").html(html);
        }
    }
}