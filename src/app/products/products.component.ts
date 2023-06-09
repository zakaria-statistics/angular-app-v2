import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  public products:Array<Product>=[];
  public keyword: string = "";
  constructor(private productService:ProductService) {
  }
  getProducts(){
        this.productService.getProducts(2,4)
      .subscribe({
        next : data =>{
          this.products = data
        },
        error : err => {
          console.log(err);
        }
      });

    //this.products$=this.productService.getProducts();
  }
  ngOnInit(){
    this.getProducts()
  }


  handleCheckProduct(product:Product){
    this.productService.checkProduct(product)
      .subscribe({
      next : updatedProduct => {
        this.products=this.products.map(p=>{
          if (p.id==product.id){
            return updatedProduct
          }else
            return p;
        })
        //product.checked=!product.checked
      }
    })
  }

  handleDelete(product: Product) {
    if (confirm("Etes vous sur?"))
    this.productService.deleteProduct(product).subscribe({
      next: value => {
        //this.getProducts()
        this.products=this.products.filter(p=>p.id!=product.id);
      }
    })
  }

  searchProducts() {
    this.productService.searchProducts(this.keyword).subscribe({
      next :value => {
        this.products=value;
      }
    })
  }
}
