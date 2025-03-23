import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Resource, ResourceType } from '../interfaces/resource.interface';
import { adaptResource } from '../adapters/resource.adapter';

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

  getResources(category: string, page = 1): Observable<{ resources: Resource[]; count: number }> {
    return this.http.get<any>(`${this.baseUrl}${category}/?page=${page}`).pipe(
      map(response => {
        const resources = response.results.map((item: any) =>
          adaptResource(item, category as ResourceType)
        );
        return {
          resources,
          count: response.count
        };
      })
    );
  }

  private formatCategoryName(key: string): string {
    return key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  }
}
