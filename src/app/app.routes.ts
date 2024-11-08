import { Routes } from '@angular/router';
import { BudgetFormComponent } from './budget-form/budget-form.component';
import { BudgetListComponent } from './budget-list/budget-list.component';

export const routes: Routes = [
    {
        path:"budget-form", component:BudgetFormComponent
    },
    {
        path:"budget-list", component:BudgetListComponent
    },

    
    { path: '', redirectTo: 'budget-list', pathMatch: 'full' },
];
