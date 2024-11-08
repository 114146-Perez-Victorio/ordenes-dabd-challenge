import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from './models/budget';

@Injectable({
  providedIn: 'root'
})
export class ElectricService {


  constructor(private http: HttpClient) { }

  private url:string = 'http://localhost:3000';

  public getModules():Observable<any>{
    return this.http.get<any>(this.url +'/module-types')
  }


  createBudget(budgetData: Budget):Observable<Budget> {
    return this.http.post<Budget>(this.url + '/budgets',budgetData)
  }

  checkClientExistence(clientName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/budgets?client=${clientName}`);
  }


  getBudget(): Observable<any> {
    return this.http.get<boolean>(`${this.url}/budgets`);
  }

}
