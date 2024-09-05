import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../model/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8089/products';

  constructor(private http:HttpClient) { }

  public getProducts(keyword: string, page:number, size:number):Observable<HttpResponse<Object>>{
    return this.http.get<Observable<HttpResponse<Object>>>(`${(this.baseUrl)}?name_like=${keyword}&_page=${page}&_limit=${size}`, {observe:"response"});
  }

  public checkProduct(product:Product):Observable<Product>{
    return this.http.patch<Product>(`${(this.baseUrl)}/${product.id}`,
      {checked:!product.checked});
  }

  public deleteProduct(productId:number){
    return this.http.delete<any>(`${(this.baseUrl)}/${productId}`);
  }

  public saveProduct(product: Product) {
    return this.http.post(`${(this.baseUrl)}`, product);
  }

  getProductById(productId: number):Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${productId}`);
  }

  updateProduct(product: Product):Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${product.id}`, product);
  }
}
