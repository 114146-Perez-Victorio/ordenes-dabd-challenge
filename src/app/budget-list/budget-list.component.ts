import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Budget, ModuleType } from '../models/budget';
import { ElectricService } from '../electric.service';
import { CommonModule, DatePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, NgFor, CommonModule],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css',
})
export class BudgetListComponent implements OnInit {
  budgets: Budget[] = []; 
  selectedBudget: Budget | null = null;

  constructor( private http: ElectricService) {}

  ngOnInit(): void {
    // Obtener los presupuestos existentes
    this.http.getBudget().subscribe((data: Budget[]) => {
      this.budgets = data;
    });
  }
  
  showBudgetDetails(budget: Budget) {
    console.log(budget);
    
    this.selectedBudget = budget;
  }

  closeDetails() {
    this.selectedBudget = null;
  }

  calculateTotal(): number {
    if (!this.selectedBudget) return 0;
    return this.selectedBudget.module.reduce((total, module) => total + module.moduleType.price, 0);
  }
  


}
