import {Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AddLanguageCustomRfrChildComponent} from "../add-language-custom-rfr-child/add-language-custom-rfr-child.component";
import {CustomRfRI18N} from "../../../../../core/administrator.service";

@Component({
  selector: 'app-add-language-custom-rfr',
  templateUrl: './add-language-custom-rfr.component.html',
  styleUrls: ['./add-language-custom-rfr.component.scss'],
  providers: [AddLanguageCustomRfrChildComponent]
})
export class AddLanguageCustomRfrComponent implements OnInit {

  @Input() list: Array<CustomRfRI18N>;

  constructor(private CFR: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.createComponent("en")
  }

  @ViewChild('viewContainerRef', {static: true, read: ViewContainerRef}) VCR: ViewContainerRef;

  createComponent(language) {
    let componentFactory = this.CFR.resolveComponentFactory(AddLanguageCustomRfrChildComponent);
    let componentRef: ComponentRef<AddLanguageCustomRfrChildComponent> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.customRfRI18N.locale = language;
    currentComponent.languageChangeEvent.asObservable().subscribe(value => this.createComponent(value));
    this.list.push(
      currentComponent.customRfRI18N
    );

  }

}
