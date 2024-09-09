import { Component } from '@angular/core';
import {AppStateService} from "../services/app-state.service";
import {LoadingService} from "../services/loading.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  actions : Array<any> = [
    {title:"Home", route:"home", icon:"house"},
    {title:"Products", route:"/admin/products", icon:"search"},
    {title:"New product", route:"/admin/newProduct", icon:"plus-circle"},
    {title:"Test", route:"/admin/test", icon:"activity"},
  ];
  currentAction:any;
  setCurrentAction(action:any){
    this.currentAction=action
  }
  constructor(public appState:AppStateService,
              public loadingService:LoadingService, private router:Router) {
  }

  handleLogout() {
    this.appState.authState = {};
    this.router.navigateByUrl("/login");
  }

  handleLogin() {
    this.router.navigateByUrl("/login")
  }
}
