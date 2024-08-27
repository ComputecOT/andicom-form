import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Andicom } from '../models/andicom';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuadientService {

  private pathBase:string = 'https://ccm.computec.com/rest/api/submit-job/andicomDocumentos';
  private http:HttpClient = inject(HttpClient);

  constructor() { }

  public sendFormQuadient(andicom:Andicom):Observable<string>{
    const andicoms:Andicom[] = [];
    andicoms.push(andicom);
    
    return this.http
                .post(this.pathBase, andicoms, {responseType: 'text'})
                .pipe(
                  catchError(this.handleError)
                );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    
    let err = `¡Ocurrió un error! Codigo: ${error.status} Error: `;

    if(error.status === 0){
      err += `No se puede conectar con el servidor de Scaler, desactive el Global o comuníquese con el equipo de desarrollo.`; 
    }

    if(error.status === 400){
      err += `${error.error}, Valide la imagen y vuelva a intentar.`;
    }

    return throwError(() => new Error(err));
  }

}
