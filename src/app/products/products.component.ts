import { Component, OnInit } from '@angular/core';
import { ProductService } from "../services/product.service";
import { Product } from "../model/product.model";
import { Router } from "@angular/router";
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppStateService } from "../services/app-state.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, public appState: AppStateService) {}

  ngOnInit() {
    this.loadProducts();
    this.appState.loadMetrics(); // Fetch metrics on initialization
  }

  loadProducts() {
    this.productService.getProducts(
      this.appState.productsState.keyword,
      this.appState.productsState.currentPage,
      this.appState.productsState.pageSize).subscribe({
      next: (response) => {
        console.log(response.body);
        let products: Array<Product> = response.body as Array<Product>;
        let totalProducts: number = parseInt(response.headers.get('X-Total-Count') as string);
        let totalPages: number = Math.ceil(totalProducts / this.appState.productsState.pageSize);
        this.appState.setProductsState({
          products: products,
          totalPages: totalPages,
        });
      },
      error: err => {
        this.appState.setProductsState({
          status:"ERROR",
          errorMessage:err
        });
      }
    });
  }

  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).pipe(
      catchError(err => {
        console.error('Failed to update product status', err);
        return of(product); // Return the unchanged product in case of error
      })
    ).subscribe(updatedProduct => {
      this.appState.productsState.products = this.appState.productsState.products.map((p: Product) => p.id === product.id ? updatedProduct : p);
      this.appState.loadMetrics(); // Update metrics after a product is checked
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
        this.appState.productsState.products = this.appState.productsState.products.filter((p: Product) => p.id !== productId);
        if (this.appState.productsState.products.length === 0 && this.appState.productsState.currentPage > 1) {
          this.appState.productsState.currentPage--;
        }
        this.loadProducts();
        this.appState.loadMetrics(); // Update metrics after a product is deleted
      });
    }
  }

  handleGoToPage(page: number) {
    if (page > 0 && page <= this.appState.productsState.totalPages) {
      this.appState.productsState.currentPage = page;
      this.loadProducts();
    }
  }

  handleEdit(productId: number) {
    this.router.navigate([`/admin/editProduct/${productId}`]);
  }
}
