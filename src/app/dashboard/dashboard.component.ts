import {Component, OnInit} from '@angular/core';
import {Product} from "../model/product.model";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  uncheckedProducts:number=0;
  constructor(public appState:AppStateService) {}

  ngOnInit(): void {
    this.uncheckedProducts = this.appState.productsState.totalProducts - this.appState.productsState.checkedProducts;
  }


  totalCheckedProducts() {
    return this.appState.productsState.products.filter((p: Product) => p.checked).length;
  }
}
