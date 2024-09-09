import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductsComponent} from "./products/products.component";
import {NewProductComponent} from "./new-product/new-product.component";
import {TestComponent} from "./test/test.component";
import {EditProductComponent} from "./edit-product/edit-product.component";
import {LoginComponent} from "./login/login.component";
import {AdminTemplateComponent} from "./admin-template/admin-template.component";
import {AuthenticationGuard} from "./guards/authentication.guard";
import {UnauthorizedComponent} from "./unauthorized/unauthorized.component";
import {AuthorizationGuard} from "./guards/authorization.guard";

const routes: Routes = [
  {path:"home", component:HomeComponent},
  {path:"login", component: LoginComponent},


  {
    path:"admin", component:AdminTemplateComponent, canActivate:[AuthenticationGuard], children:[
      {path:"products", component:ProductsComponent, canActivate:[AuthorizationGuard], data:{roles:['USER']}},
      {path:"newProduct", component:NewProductComponent, canActivate:[AuthorizationGuard], data:{roles:['ADMIN']}},
      {path:"editProduct/:id", component:EditProductComponent, canActivate:[AuthorizationGuard], data:{roles:['ADMIN']}},
      {path:"test", component:TestComponent},
    ]
  },
  {path:"unauthorized", component:UnauthorizedComponent, canActivate:[AuthenticationGuard]},
  {path:"", redirectTo:"home", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
