import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function regexValidator(pattern: RegExp, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !pattern.test(control.value)) {
      return { [errorKey]: true };
    }
    return null;
  };
}