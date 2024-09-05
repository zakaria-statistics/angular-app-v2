import {Component, OnInit} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{

  public products:Array<Product>=[];
  public keyword: string ="";
  public totalPages:number=0;
  public pageSize:number=5;
  public currentPage=1;

  constructor(private productService:ProductService) {
  }

  getProducts(){
    this.productService.getProducts(this.keyword, this.currentPage, this.pageSize).subscribe({
      next: value => {
        this.products = value.body as Array<Product>
        let totalProducts = parseInt(<string>value.headers.get("X-Total-Count"));
        this.totalPages = Math.floor(totalProducts / this.pageSize);
        totalProducts % this.pageSize != 0 ? this.totalPages++ : true;
        //console.log(`totalPorduct = ${totalProducts} and pageSize = ${this.pageSize} and totalPages = ${this.totalPages}`)
      },
      error: err => {
        console.log(err)
      }
    })
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
      },
        error: err => {
        console.log(err);
        }
    })
  }

  handleDelete(product: Product) {
    if (confirm("Etes vous sur?"))
    this.productService.deleteProduct(product).subscribe({
      next: () => {
        this.products=this.products.filter(p=>p.id!=product.id);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  handleGoToPage(page: number) {
    this.currentPage = page;
    this.getProducts()
  }
}
