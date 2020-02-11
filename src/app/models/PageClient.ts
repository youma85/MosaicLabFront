import { OnInit } from '@angular/core';
import { Customer } from '../customer-list/customer-list.component';

export class PageClient {
    content : Customer[];
    totalPages : number;
    totalElements : number;
    last : boolean;
    size : number ;
    first : boolean ;
    sort : string ;
    numberOfElements : number ;

}