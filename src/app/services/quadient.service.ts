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
    return throwError(() => new Error(`¡Valide los datos y póngase en contacto con el equipo de desarrollo! Codigo: ${error.status}`));
  }

}
