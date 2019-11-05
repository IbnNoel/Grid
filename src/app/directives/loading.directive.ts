import { Directive, ElementRef, OnInit } from '@angular/core';
import { LoaderService } from '../core/loader.service';
import * as $ from 'jquery';

@Directive({
  selector: '[loadingDialog]'
})
export class LoadingDirective implements OnInit {
  constructor(private el: ElementRef, private loadingService : LoaderService) {
 
    this.loadingService.isLoading.subscribe(v => {
      this.toogleLoader(v);
    });
    //el.nativeElement
 }

 ngOnInit() {
  $(this.el.nativeElement).addClass("ui segment");
  $(this.el.nativeElement).append('<div class="mask hidden"></div><div class="ui inverted active dimmer hidden"><div class="ui big loader"></div></div>');
 }

  toogleLoader(isLoading){
    $(this.el.nativeElement).find(".mask").toggleClass("hidden", !isLoading);
    $(this.el.nativeElement).find(".dimmer").toggleClass("hidden", !isLoading);
  }

}


