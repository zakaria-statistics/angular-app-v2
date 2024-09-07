
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../services/product.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Product} from "../model/product.model";

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId!:number;
  updatedProductFormGroup!:FormGroup;
  constructor(private activatedRoute:ActivatedRoute,
              private productService:ProductService, private fb:FormBuilder) {
  }

  ngOnInit(): void {
    // Initialize the form with default values to prevent undefined errors
    this.updatedProductFormGroup = this.fb.group({
      id: this.fb.control(''),
      name: this.fb.control(''),
      description: this.fb.control(''),
      price: this.fb.control(0),
      checked: this.fb.control(false)
    });

    this.productId = this.activatedRoute.snapshot.params['id'];
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        // Populate the form once the product data is retrieved
        this.updatedProductFormGroup.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          checked: product.checked
        });
      },
      error: err => {
        console.error('Error fetching product:', err);
      }
    });
  }


  onSubmit() {
    let product:Product = this.updatedProductFormGroup.value;
    this.productService.updateProduct(product).subscribe({
      next:value => {
        alert(JSON.stringify(value));
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.updatedProductFormGroup.get(controlName);

    if (control?.hasError('required')) {
      return 'This field is required.';
    }

    if (control?.hasError('min')) {
      return 'Price must be a positive number.';
    }

    return '';
  }
}
