import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  errorMessage:undefined;
  formLogin!:FormGroup;
  constructor(private fb:FormBuilder, private router:Router, private authService:AuthService) {
  }
  ngOnInit(): void {
    this.formLogin = this.fb.group({
      username:this.fb.control(""),
      password:this.fb.control("")
    })
  }


  public handleLogin() {
    let username=this.formLogin.value.username;
    let password=this.formLogin.value.password;
    this.authService.login(username, password)
      .then(()=>{
        this.router.navigateByUrl("/admin");
      })
      .catch(error =>{
        this.errorMessage = error
    })
  }
}
