// star-wars.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {
  private baseUrl = 'https://swapi.dev/api/';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ name: string, path: string }[]> {
    return this.http.get<{ [key: string]: string }>(this.baseUrl).pipe(
      map(response => {
        console.log("response", response);        
        return Object.entries(response).map(([key, url]) => ({
          name: this.formatCategoryName(key),
          path: key
        }))
      } 
      )
    );
  }

  private formatCategoryName(key: string): string {
    return key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  }
}
