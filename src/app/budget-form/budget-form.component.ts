import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElectricService } from '../electric.service';
import { Budget, ModuleType, Zone } from '../models/budget';
import { clientUniqueValidator } from '../validators/client-unique.validator';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NgIf],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit {


  budgetForm!: FormGroup;
  zones: string[] = Object.values(Zone); // Lista de zonas (Living, Comedor, Cocina, Dormitorio)
  moduleArray: ModuleType[] = []; // Array de módulos obtenidos de la API
  maxSlotsPerBox = 3;  // Máximo de 3 slots por caja
  
  //inyeccion de servicio
  private readonly http = inject(ElectricService);

  ngOnInit(): void {
    // Obtiene los módulos de la API
    //CON ESTO TRAIGO LA INFORMACION DE LOS MODULOS 
    this.http.getModules().subscribe((data: ModuleType[]) => {
      console.log(data);
      this.moduleArray = data;
      console.log(this.moduleArray);
    }, (error) => {
      console.log(error);
    });

    // Construcción del formulario reactivo
    this.budgetForm = this.fb.group({
      client: ["", [Validators.required],[clientUniqueValidator(this.http)]],
      date: ["", [Validators.required, this.validateDate]],
      modules: this.fb.array([], Validators.minLength(5)) // Al menos 3 módulos
    });
  }

  constructor(private fb: FormBuilder) {}

  // Método para obtener el FormArray de módulos
  get Modules(): FormArray {
    return this.budgetForm.get("modules") as FormArray;
  }


  //VERIFICAR LA CANTIDAD DE SLOTS
/*   checkSlotsInBox(): void {
    let totalSlots = 0;
    // Calcular la cantidad total de slots ocupados en todos los módulos
    this.Modules.controls.forEach((moduleControl: AbstractControl) => {
      const slots = moduleControl.get('slots')?.value;
      if (slots) {
        totalSlots += slots;
      }
    });
    console.log(totalSlots, 'total slots');
    console.log(this.maxSlotsPerBox, 'max slots');
    
    
    // Verificar si se excede el máximo de slots
    if (totalSlots > this.maxSlotsPerBox) {
      alert('La cantidad total de slots excede el máximo permitido por caja');
    }
  } */

  // Validación de la fecha (la fecha debe ser hoy o anterior)
  validateDate(control: any): { [key: string]: any } | null {
    let today = new Date();
    let selectedDate = new Date(control.value);
    return selectedDate > today ? { invalidDate: true } : null;
  }

  // Método para añadir un módulo
  addModule(): void {
    if (this.Modules.length < 5) { // Limitar a 5 módulos
      let moduleForm = this.fb.group({
        type: ['', Validators.required], // Tipo de módulo
        price: [{ value: '', disabled: true }],
        slots: [{ value: '', disabled: true }],
        environment: ['', Validators.required], // Zona del módulo
      });
  
      this.Modules.push(moduleForm);
    } else {
      alert('No puedes agregar más de 5 módulos');
    }
  }
  

  removeModule(index: number): void {
    // Eliminar el módulo del FormArray
    this.Modules.removeAt(index);
  
    // Recalcular la cantidad total de slots ocupados
    //this.checkSlotsInBox();
  }
  

  // Método para actualizar la información de un módulo cuando se cambia el tipo
  onModuleTypeChange(index: number): void {
    let selectedModuleId = this.Modules.at(index).get('type')?.value;
    let selectedModule = this.moduleArray.find(module => module.id === selectedModuleId);

    if (selectedModule) {
      let moduleForm = this.Modules.at(index);
      moduleForm.patchValue({
        price: selectedModule.price,
        slots: selectedModule.slots
      });
      // Verificar si se excede el límite de slots en la caja
      //this.checkSlotsInBox();
    }
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.budgetForm.valid) {
      // Convertir el nombre a mayúsculas antes de enviarlo
      let clientName = this.budgetForm.value.client.toUpperCase();
  
      let budgetData: Budget = {
        client: clientName, // Asignamos el nombre en mayúsculas
        date: this.budgetForm.value.date,
        module: this.budgetForm.value.modules.map((module: any) => ({
          moduleType: this.moduleArray.find(m => m.id === module.type), // Buscar el moduleType
          zone: module.environment, // Zona seleccionada
          price: module.price,
          slots: module.slots
        }))
      };
  
      console.log(budgetData, 'data de presupuesto');
      
      // Aquí puedes enviar el presupuesto al backend
      this.http.createBudget(budgetData).subscribe(response => {
        console.log('Presupuesto creado', response);
      });
    }
  }
  
}
