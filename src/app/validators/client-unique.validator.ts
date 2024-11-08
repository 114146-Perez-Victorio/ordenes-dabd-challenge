
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { ElectricService } from '../electric.service';

export function clientUniqueValidator(electricService: ElectricService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);  // Si el campo está vacío, no validamos
      }
  
      let clientName = control.value.toUpperCase();  // Convertir el valor a mayúsculas
  
      return electricService.checkClientExistence(clientName).pipe(
        debounceTime(300), // Espera 300ms después de que el usuario termine de escribir
        switchMap(clientExists => {
          console.log('clientExists:', clientExists);  // Agrega un log aquí para depurar
  
          // Si clientExists es un array, verificamos su longitud
          if (Array.isArray(clientExists) && clientExists.length > 0) {
            return of({ clientExists: true });  // El cliente ya tiene un presupuesto
          }
          // Si no existe el cliente (array vacío o booleano false)
          return of(null);  // El cliente no tiene un presupuesto registrado
        }),
        catchError((error) => {
          console.error('Error en la validación:', error);  // Agrega un log en caso de error
          return of(null);  // Si ocurre un error, la validación pasa
        })
      );
    };
  }
  