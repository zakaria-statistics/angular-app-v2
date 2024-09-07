import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  public productForm!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  // Initialize form with validation rules
  initializeForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(100)]],
      checked: [false]
    });
  }

  // Save product function
  saveProduct() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      this.productService.saveProduct(product).subscribe({
        next: value => {
          alert("Product saved successfully: " + JSON.stringify(value));
          this.resetForm(); // Reset form after successful save
        },
        error: err => {
          console.error(err);
          alert("Failed to save product. Please try again.");
        }
      });
    } else {
      this.productForm.markAllAsTouched(); // Mark fields as touched if form is invalid
      alert("Please fix the validation errors before submitting.");
    }
  }

  // Reset form after saving the product
  resetForm() {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      checked: false
    });
  }

  // Enhanced getErrorMessage function to handle different types of errors dynamically
  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);

    if (control?.hasError('required')) {
      return `${this.capitalize(controlName)} is required.`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.getError('minlength')?.requiredLength;
      return `${this.capitalize(controlName)} must be at least ${requiredLength} characters long.`;
    }
    if (control?.hasError('min')) {
      const minValue = control.getError('min')?.min;
      return `${this.capitalize(controlName)} must be at least ${minValue}.`;
    }
    return '';
  }

  // Utility function to capitalize the first letter of a string
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
