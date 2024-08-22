import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { QuadientService } from './services/quadient.service';
import { Andicom } from './models/andicom';
import { regexValidator } from './shared/regexValidator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Atributos
  protected date!: string;
  private andicom!:Andicom;
  protected formCreate!: FormGroup;

  // Injeccion de dependecias
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly quadientService: QuadientService = inject(QuadientService);

  ngOnInit(): void {
    this.date = `Bogotá, ${this.generateDate()}`;
    this.initFormCreate();
  }

  // Creacion del formulario
  private initFormCreate(): void {
    this.formCreate = this.formBuilder.group({
      Nombre: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, regexValidator(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'emailInvalido')]),
      Celular: new FormControl('', [Validators.required, regexValidator(/^3\d{9}$/, 'celularInvalido')]),
      Cargo: new FormControl(''),
      Empresa: new FormControl(''),
      informacion: new FormControl(''),
      "URL logo": new FormControl('')
    });
  }

  // Enviar los datos al servicio de quadient
  public sendToQuadient(): void {

    if(!this.formCreate.valid){
      return;
    }

    this.andicom = this.formCreate.value;

    this.andicom.Parrafos = this.formCreate
                                .get('informacion')?.value
                                .split('\n')
                                .filter((parrafo: string | any[]) => parrafo.length > 0);

    Swal.fire({
      title: 'Generando...',
      text: 'Por favor, espere.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.quadientService.sendFormQuadient(this.andicom).subscribe({
      next: (response: string) => {
        Swal.fire({
          title: "Enviado con éxito!",
          //text: response,
          icon: "success",
          showConfirmButton: true
        });

        this.formCreate.reset();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error!',
          text: `${error.message}`,
          icon: 'error',
          showConfirmButton: true
        });
      },      
    });
  }

  // Generar la fecha actual para mostrar
  public generateDate(): string {
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = fecha.toLocaleString('es-ES', { month: 'long' });
    const anio = fecha.getFullYear();

    return `${dia} ${mes} ${anio}`;
  }
}
