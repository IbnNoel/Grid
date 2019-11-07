import {Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AddLanguageCustomRfrChildComponent} from "../add-language-custom-rfr-child/add-language-custom-rfr-child.component";

@Component({
  selector: 'app-add-language-custom-rfr',
  templateUrl: './add-language-custom-rfr.component.html',
  styleUrls: ['./add-language-custom-rfr.component.scss'],
  providers: [AddLanguageCustomRfrChildComponent]
})
export class AddLanguageCustomRfrComponent implements OnInit {

  constructor(private CFR: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.createComponent("en")
  }

  @ViewChild('viewContainerRef', {static: true, read: ViewContainerRef}) VCR: ViewContainerRef;
  componentsReferences = [];

  createComponent(language) {
    let componentFactory = this.CFR.resolveComponentFactory(AddLanguageCustomRfrChildComponent);
    let componentRef: ComponentRef<AddLanguageCustomRfrChildComponent> = this.VCR.createComponent(componentFactory);
    let currentComponent = componentRef.instance;
    currentComponent.selectedLanguage = language;
    this.componentsReferences.push(componentRef);
  }

}
