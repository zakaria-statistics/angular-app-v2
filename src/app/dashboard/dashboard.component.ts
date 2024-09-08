import {Component, OnInit} from '@angular/core';
import {Product} from "../model/product.model";
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{


  constructor(public appState:AppStateService) {}

  ngOnInit(): void {

  }
}
