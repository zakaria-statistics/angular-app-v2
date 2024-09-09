import { Component } from '@angular/core';
import {AppStateService} from "../services/app-state.service";
import {LoadingService} from "../services/loading.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  actions : Array<any> = [
    {title:"Home", route:"/admin/home", icon:"house"},
    {title:"Products", route:"/admin/products", icon:"search"},
    {title:"New product", route:"/admin/newProduct", icon:"plus-circle"},
    {title:"Test", route:"/admin/test", icon:"activity"},
  ];
  currentAction:any;
  setCurrentAction(action:any){
    this.currentAction=action
  }
  constructor(public appState:AppStateService,
              public loadingService:LoadingService) {
  }
}
