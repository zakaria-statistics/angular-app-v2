import { Component, OnInit } from '@angular/core';
import { ProductService } from "../services/product.service";
import { Product } from "../model/product.model";
import { Router } from "@angular/router";
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, public appStateService:AppStateService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(
      this.appStateService.productsState.keyword,
      this.appStateService.productsState.currentPage,
      this.appStateService.productsState.pageSize).pipe(
      map(response => {
        const totalProducts = parseInt(response.headers.get("X-Total-Count") || '0', 10);
        this.appStateService.productsState.totalProducts = totalProducts;
        this.appStateService.productsState.totalPages = Math.ceil(totalProducts / this.appStateService.productsState.pageSize);
        return response.body as Product[];
      }),
      catchError(err => {
        console.error('Failed to load products', err);
        return of([]);
      })
    ).subscribe(products => {

      this.appStateService.productsState.products = products;
      this.appStateService.productsState.checkedProducts = products.filter((p:Product)=> p.checked).length;
    });
  }

  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).pipe(
      catchError(err => {
        console.error('Failed to update product status', err);
        return of(product); // Return the unchanged product in case of error
      })
    ).subscribe(updatedProduct => {

      this.appStateService.productsState.products = this.appStateService.productsState.products.map((p:Product) => p.id === product.id ? updatedProduct : p);
    });
  }

  handleDelete(productId: number) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct(productId).pipe(
        catchError(err => {
          console.error('Failed to delete product', err);
          return of(null);
        })
      ).subscribe(() => {
        this.appStateService.productsState.products = this.appStateService.productsState.products.filter((p:Product) => p.id !== productId);
        if (this.appStateService.productsState.products.length === 0 && this.appStateService.productsState.currentPage > 1) {
          this.appStateService.productsState.currentPage--;
        }
        this.loadProducts();
      });
    }
  }

  handleGoToPage(page: number) {
    if (page > 0 && page <= this.appStateService.productsState.totalPages) {
      this.appStateService.productsState.currentPage = page;
      this.loadProducts();
    }
  }

  handleEdit(productId: number) {
    this.router.navigate([`/editProduct/${productId}`]);
  }
}
