import { Injectable } from '@angular/core';
import { ProductService } from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  public productsState: any = {
    products: [],
    keyword: "",
    totalPages: 0,
    pageSize: 5,
    currentPage: 1,
    totalProducts: 0,
    checkedProducts: 0,
    uncheckedProducts: 0,
    totalPrice: 0,
    status:"",
    errorMessage:"",
  };
  public authState:any={
    isAuthenticated:false,
    username:undefined,
    roles:undefined,
    token:undefined
  }

  constructor(private productService: ProductService) {}

  public setProductsState(state: any): void {
    this.productsState = { ...this.productsState, ...state };
  }
  public setAuthState(state:any):void{
    this.authState = {...this.authState, ...state};
  }

  public loadMetrics(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const totalProducts = products.length;
        const checkedProducts = products.filter(product => product.checked).length;
        const uncheckedProducts = totalProducts - checkedProducts;
        const totalPrice = products.reduce((acc, product) => acc + product.price, 0);

        this.setProductsState({
          totalProducts: totalProducts,
          checkedProducts: checkedProducts,
          uncheckedProducts: uncheckedProducts,
          totalPrice: totalPrice
        });
      },
      error: (err) => {
        console.error('Error fetching all products for metrics:', err);
      }
    });
  }
}
