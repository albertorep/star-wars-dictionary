import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Resource, ResourceType } from '../interfaces/resource.interface';
import { adaptResource } from '../adapters/resource.adapter';
import { BehaviorSubject } from 'rxjs';

export const filterableFieldsMap: Record<ResourceType, string[]> = {
  [ResourceType.People]: ['name'],
  [ResourceType.Films]: ['title'],
  [ResourceType.Planets]: ['name'],
  [ResourceType.Starships]: ['name', 'model'],
  [ResourceType.Vehicles]: ['name', 'model'],
  [ResourceType.Species]: ['name'],
};

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {
  private baseUrl = 'https://swapi.tech/api/';
  private tabsLoadingSubject = new BehaviorSubject<boolean>(true);
  tabsLoading$ = this.tabsLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ name: string; path: string }[]> {
    this.tabsLoadingSubject.next(true);
  
    return this.http.get<{ result: { [key: string]: string } }>(this.baseUrl).pipe(
      map(response =>
        Object.entries(response.result).map(([key, url]) => ({
          name: this.formatCategoryName(key),
          path: key
        }))
      ),
      tap(() => this.tabsLoadingSubject.next(false)),
      catchError(error => {
        console.error('Error loading categories:', error);
        this.tabsLoadingSubject.next(false);
        return of([]);
      })
    );
  }
  
  

  getResources(category: string, page = 1): Observable<{ resources: Resource[], count: number }> {
    return this.http.get<any>(`${this.baseUrl}${category}?page=${page}&limit=10&expanded=true`).pipe(
      map(response => {
        const resources = (response.results || response.result || []).map((item: any) => {
          const id = item.uid;
          const props = item.properties;
          return adaptResource(props, category as ResourceType, id);
        });
        return {
          resources,
          count: response.total_records
        };
      }),
      catchError(error => {
        console.error(`Error fetching ${category} (page ${page}):`, error);
        return of({ resources: [], count: 0 });
      })
    );
  }
  
  filterResources(category: string, field: string, value: string): Observable<Resource[]> {
    const url = `${this.baseUrl}${category}?${field}=${encodeURIComponent(value)}`;
  
    return this.http.get<any>(url).pipe(
      map(response => {
        const results = response.results || response.result || [];
        return results.map((item: any) => {
          const id = item.uid;
          const props = item.properties;
          return adaptResource(props, category as ResourceType, id);
        });
      }),
      catchError(err => {
        console.error(`Error filtering ${category} by ${field}:`, err);
        return of([]);
      })
    );
  }
  

  private formatCategoryName(key: string): string {
    return key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  }
}
