import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
[x: string]: any;
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  actions : Array<any> = [
    {title:"Home", route:"/home", icon:"house"},
    {title:"Products", route:"/products", icon:"search"},
    {title:"New product", route:"/newProduct", icon:"plus-circle"}
    ];
    currentAction:any;
    setCurrentAction(action:any){
      this.currentAction=action
    }
}
