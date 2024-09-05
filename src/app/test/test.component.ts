import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  counter : number =1;
  name: string=""
  ;
  increment() {
    ++this.counter;
    this.name = `increment ${this.counter}`;
  }
  decrement() {
    --this.counter;
    this.name=`decrement ${this.counter}`;
  }
}
