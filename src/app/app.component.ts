import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fromEvent, merge, Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {Product} from './model/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('productNameInput', {static: false}) productNameInput: ElementRef;

  products: Product[] = [
    {name: 'TABLE', price: 250},
    {name: 'CHAIR', price: 650},
    {name: 'PEN', price: 230},
    {name: 'PENCIL', price: 210},
    {name: 'FLOOR', price: 650},
    {name: 'DOOR', price: 330}
  ];

  products$: Observable<Product[]>;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.products$ = merge(
      fromEvent(this.productNameInput.nativeElement, 'keyup'),
      fromEvent(window, 'load'))
      .pipe(
        map((event: any) => event.target.value || ''),
        debounceTime(1000), // po ustalonym czasie emitowana jest ostatnio wprowadzona dana
        distinctUntilChanged(),
        tap(data => console.log('FROM INPUT ELEMENT: ' + data)),
        switchMap(value => value === '' ?
          of(this.products) :
          of(this.products.filter(prod => prod.name.includes(value)))
        ));
  }
}
