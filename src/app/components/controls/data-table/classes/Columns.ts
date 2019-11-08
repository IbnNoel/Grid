export class HandleColumnSettings{

    private colSettings : DataTables.ColumnSettings = {
      orderable : false
    };

    constructor(setting: ColumnDefs){
     this.colSettings.className = "key_" + setting.key;
     this.colSettings.title = setting.key;

     Object.entries(setting).forEach(([key, value]) => { 
        if (value && this[key + "_Func"])
         this[key + "_Func"](value)
      });
    }

    getDataTablesColumns(){
      return this.colSettings;
    }

    header_Func(header: string){
      this.colSettings.className += " head_" + header.replace(" ","_");
      this.colSettings.className = this.colSettings.className.replace("/", "_");
      this.colSettings.title = header;
    }

    key_Func(key: string){
      this.colSettings.name = key;
      this.colSettings.data = key;
    }

    className_Func(className: string){
      this.colSettings.className += " " + className;
    }

    cellElement_Func(func : FunctionCellElement){
      this.colSettings.defaultContent = "";
      this.colSettings.createdCell = (cell,cellData,rowData,row,col) => {
        
         var elementValue = func(cellData,rowData,row,col);
         if(elementValue instanceof GPFIButton){
          var button = elementValue as GPFIButton;
          button.Html.click(rowData, (e) => {
            button.OnClick(rowData);
          });
           $(cell).append(elementValue.Html);
         }else {
        
         }
      };
      this.colSettings.className += " gpfi_tbl_customCell";
    }

    default_Func(){}

    translate_Func(){}

    formatter_Func(func: (any) => string){
      this.colSettings.render = func;
    }

    type_Func(){}

    sortable_Func(){}

    collapseGrid_Func(){}

    width_Func(){}

    hideCollapsed_Func(){}

    detailColumn_Func(){}

    calculateTotal_Func(){
      // totalCalculateColumns[colElement.key] = "";
    }
  }



  // TODO:- Add description to each property

  export interface ColumnDefs{
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
    calculateTotal?:boolean;
    /**
     * The Default text which will appear in the column cell
     */
    default?: string;
    /**
     * A callback used to create dynamic data for the cell. //TODO:- add more information and describe return function 
     */
    cellElement?: FunctionCellElement | HTMLElement | GPFIButton;
    translate?: boolean;
    formatter?:DataTables.FunctionColumnRender;
    /** TODO:- Create an Enum for this type */
    type?:any;
    sortable?:string;
    collapseGrid?: string;
    width?:number;
    hideCollapsed?:boolean;
    detailColumn?:any;
  }

  type FunctionCellElement = (cellData?: any, rowData?: any, row?: number, col?: number) => HTMLButtonElement | HTMLElement  | GPFIButton | string;

  export class GPFIButton {
     private html : JQuery<HTMLElement>; 
     private onClick:any;

    constructor(name, onClick, cssClass?){
      let classes = cssClass || "btn-default";
      this.html =$(`<button class="btn  ${classes}"> ${name} </button>`);
      this.onClick = onClick;
    }

    get Html(){
      return this.html;
    }

    OnClick(rowData){
      return this.onClick(rowData);
    }
  }

