import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataTableComponent } from '../data-table.component';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, map, combineAll, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import { ExpansionSettings, ExpansionSettingsHandler } from './Expansion';

 export class PageSettings{
    private _pageSize = 10;
    private _totalRecords = 0;
    private _currentPage = 1;
    private _onPageChange : any;


    // TODO:- Page return function a promise!!
    constructor(onPageChangeFunc: () => void){
      this._onPageChange = onPageChangeFunc;
    }

    onPageChange(){
       return this._onPageChange();
    }

    get pageSize(){
      return this._pageSize;
    }

    set pageSize(pageSize){
      this._pageSize = pageSize;
    }

    get pagesNumber(){
      return Math.ceil(this._totalRecords/ this._pageSize);
    }

    getTotalRecords(){
      return this._totalRecords;
    }

    setTotalRecords(totalRecords){
      this._totalRecords = totalRecords;
    }

    get currentPage(){
      return this._currentPage;
    }

    set currentPage(currentPage){
      this._currentPage = currentPage;
    }
  }

  export class PageLengthControl{
    private _tableApi : any;
    private _tableHolder : JQuery<any>;
    private _pagingSettings : PageSettings;
    private _translate: TranslateService;
    
    constructor(dtComponent: DataTableComponent){
      this._tableApi = dtComponent.dataTableApi;
      this._pagingSettings = dtComponent.PageSettings;
      this._translate = dtComponent.translateService;

      this.init();
    }

    private getDataTablesHolder(){
      return  $(this._tableApi.context[0].nTableWrapper).find(".dataTables_length");/*.removeClass("dataTables_length").addClass(classes);*/
    }

    private getLengthElement(){
      return this.getDataTablesHolder().find("select");
    }

    private init(){
      from(["showTenPerPage", "showTwentyPerPage", "showThirtyPerPage", "showFiftyPerPage"]).pipe(
        switchMap((val) => this._translate.get(val)),
        toArray()
      ).subscribe((LENGTHNAMES)=>{
        let lengthSelect = this.getLengthElement();
        lengthSelect.addClass("wuselect pr40").removeClass("input-sm");
        lengthSelect.find("option").each(function (i) {
          $(this).html(LENGTHNAMES[i]);
        });
        this.setUpEvent();
        this.getDataTablesHolder().removeClass("dataTables_length").addClass("tables_length text-right dtLength ");
      });
    }

    private setUpEvent(){
      let selectControl = this.getLengthElement();
      selectControl.off();
      selectControl.change(()=>{
        this._pagingSettings.currentPage = 1;
        this._pagingSettings.pageSize = selectControl.val() as number;
        if(this._tableApi.data().length > 0){
          this._pagingSettings.onPageChange();
        }
      });
    }

  }

  export class PagingHelper{
    private _tableApi : any;
    private _pagingSettings : PageSettings;
    private _maxPageNumberBtn = 5;
    private _startingPageNumberBtn = 1;
    private _lengthControl: PageLengthControl;
    private _expansionSettings:ExpansionSettings;
    private _expansionSettingsHandler: ExpansionSettingsHandler;

    constructor(dtComponent: DataTableComponent){
      this._tableApi = dtComponent.dataTableApi;
      this._pagingSettings = dtComponent.PageSettings;
      this.getPageHolder().addClass("gpfiPagination");
      this._lengthControl = new PageLengthControl(dtComponent);
      this._expansionSettings = dtComponent.ExpansionSettings;
      this._expansionSettingsHandler = dtComponent.expansionSettingsHandler;
    }

    renderButtons(){
      if(this._pagingSettings.pagesNumber == 0){
          this.hidePagingButtons();
          return;
      }
      let pageButtonDiv = this.getPageButtonDiv();
      pageButtonDiv.html("").append(this.createPrvBtn());
      this.calculateStartingMaxPageNumbers();
      let numberOfPages = this.getPageNumbers();
      for (var i = this._startingPageNumberBtn; i < numberOfPages + 1; i++) {
        pageButtonDiv.append(this.createPageNoButtons(i));
      }
      pageButtonDiv.append(this.createNxtBtn()).addClass("pagination-sm");
      this.getPageHolder().css("display", "block");
    }

    initPaging(createTableFunc:() => void){
        this.hidePagingButtons();
        this._tableApi.page.len(this._pagingSettings.pageSize);
        createTableFunc();
        this.renderButtons();
    }

    hidePagingButtons(){
        this.getPageHolder().css("display", "none");
    }

    private onPageButtonClick = (event) => {
        var pageNo = event.data.page;
        this.hidePagingButtons();
        // add loading overLay
        this._pagingSettings.currentPage = pageNo;
        if(this._expansionSettings){
          this._expansionSettingsHandler.deleteChildComponents();
        }
        this._pagingSettings.onPageChange();
    }

    private createPrvBtn(){
      let tableClass = this.getTableClass();
      let firstName = "first";
     
      var prBtn = $(`<li class='page-item previous' id='${tableClass}_previous'><a role='button' aria-controls='${tableClass}' data-dt-idx='0' tabindex='0'>${firstName}</a></li>`);
      if (this._pagingSettings.currentPage == 1) {
          prBtn.addClass('disabled');
      } else {
          prBtn.click({page:1},this.onPageButtonClick);
      }
      return prBtn;
    }

    private createPageNoButtons(pageNumber){
      let tableClass = this.getTableClass();
      var liEle = $(`<li class='page-item'><a role='button' class='page-link' aria-controls='${tableClass}' data-dt-idx='${pageNumber}' tabindex='0'>${pageNumber}</a></li>`);

      if (this._pagingSettings.currentPage == pageNumber) {
          liEle.addClass('active');
      }
      liEle.click({page:pageNumber},this.onPageButtonClick);

      return liEle;
    }

    private createNxtBtn(){
      let tableClass = this.getTableClass();
      let lastName = "last";
      var nxBtn = $(`<li class='page-item next' id='${tableClass}_next'><a role='button' aria-controls='${tableClass}' data-dt-idx='2' tabindex='0'>${lastName}</a></li>`);

      if (this._pagingSettings.currentPage == this.getPageNumbers()) {
          nxBtn.addClass('disabled');
      } else {
          nxBtn.click({page:this.getPageNumbers()},this.onPageButtonClick);
      }
      return nxBtn;
    }

    private calculateStartingMaxPageNumbers(){
      let currentPage = this._pagingSettings.currentPage;
      let pagesNo = this._pagingSettings.pagesNumber;

      if (currentPage == pagesNo && !(this._maxPageNumberBtn > currentPage)) {
          this._startingPageNumberBtn = currentPage - 2;
          this._maxPageNumberBtn = pagesNo;
      }

      if (currentPage == 1) {
          this._startingPageNumberBtn = 1;
          this._maxPageNumberBtn = 5;
      }

      if ((currentPage == this._maxPageNumberBtn || currentPage == this._startingPageNumberBtn) &&
          (currentPage > 1 && currentPage < pagesNo)) {
          this._maxPageNumberBtn = currentPage + 2;
          this._startingPageNumberBtn = currentPage - 2;
      }
    }

    private getPageNumbers(){
      let pagesNo = this._pagingSettings.pagesNumber;
      return  (pagesNo > this._maxPageNumberBtn) ? this._maxPageNumberBtn : pagesNo
    }

    private getPageHolder(){
      return $(this._tableApi.context[0].nTableWrapper).find(".dataTables_paginate");
    }
  
    private getPageButtonDiv(){
      return $(this._tableApi.context[0].nTableWrapper).find('.pagination');
    }
  
    private getTableClass() {
        return this._tableApi.context[0].sInstance;
    }
  }