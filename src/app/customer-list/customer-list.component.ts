import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CustomerServiceService } from '../customer-service.service';
import { PageClient } from '../models/PageClient';
import { startWith, switchMap, map, catchError, finalize, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit,AfterViewInit {

  displayedColumns: string[] = ['No', 'name', 'surname', 'Mail'];
  datasourceCust: CustomerDataSource;
  resultsLength = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private serviceCustomer: CustomerServiceService) {}

  ngOnInit() {
    this.datasourceCust = new CustomerDataSource(this.serviceCustomer);
    this.datasourceCust.loadCustomers(0, 3);
    this.serviceCustomer.countAll().subscribe(size => this.resultsLength = size);
  }

  ngAfterViewInit() {
    this.paginator.page
        .pipe(
            tap(() => this.loadCustomerPage())
        )
        .subscribe();
  }

  loadCustomerPage(){
    this.datasourceCust.loadCustomers(
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }
}

export interface Customer {
  id: number;
  name: string;
  surname: string;
  mail: string;
}

export class CustomerDataSource implements DataSource<Customer> {

  private lessonsSubject = new BehaviorSubject<Customer[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public resultsLength = 0;

  public loading$ = this.loadingSubject.asObservable();

  constructor(private coursesService: CustomerServiceService) {}

  connect(collectionViewer: CollectionViewer): Observable<Customer[]> {
      return this.lessonsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
      this.lessonsSubject.complete();
      this.loadingSubject.complete();
  }

  loadCustomers(pageIndex = 0, pageSize = 3) {
      this.loadingSubject.next(true);
      this.coursesService.getPageClient(pageIndex, pageSize).pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((pageClient: PageClient) => {
          this.lessonsSubject.next(pageClient.content);
      });
  }
}
