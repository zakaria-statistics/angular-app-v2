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
    {title:"Home", route:"/home", icon:"house"},
    {title:"Products", route:"/products", icon:"search"},
    {title:"New product", route:"/newProduct", icon:"plus-circle"},
    {title:"Test", route:"/test", icon:"activity"},
  ];
  currentAction:any;
  setCurrentAction(action:any){
    this.currentAction=action
  }
  constructor(public appState:AppStateService,
              public loadingService:LoadingService) {
  }
}
