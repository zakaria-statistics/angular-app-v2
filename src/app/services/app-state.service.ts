import { Injectable } from '@angular/core';
import {ProductService} from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  public productsState:any = {
    products: [],
    keyword: "",
    totalPages: 0,
    pageSize: 5,
    currentPage: 1,
    totalProducts: 0,
    checkedProducts: 0,
    uncheckedProducts:0,
    totalPrice:0,
  }
  constructor() { }

  public setProductsState(state:any):void{
    this.productsState = {...this.productsState, ...state}
  }
}
