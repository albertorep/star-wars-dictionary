import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Resource, ResourceType } from '../interfaces/resource.interface';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-expanded-card',
  imports: [TitleCasePipe, NgFor, NgClass],
  templateUrl: './expanded-card.component.html',
  styleUrl: './expanded-card.component.scss'
})
export class ExpandedCardComponent {
  @Input() resource!: Resource;
  @Output() close = new EventEmitter<void>();
  

  entries: [string, any][] = [];
  isClosing = false;
  enrichedResource!: Resource;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resource'] && this.resource) {
      const excludeKeys = ['id', 'name', 'type', 'created', 'edited', 'url'];
      this.entries = [];
  
      this.enrichedResource = { ...this.resource };
  
      this.enhanceResource(this.resource).then((enhanced) => {
        this.enrichedResource = enhanced;
        this.entries = Object.entries(enhanced).filter(
          ([key, value]) => !excludeKeys.includes(key.toLowerCase()) &&
            value !== null &&
            value !== '' &&
            value !== 'unknown' &&
            value !== 'n/a' &&
            !(Array.isArray(value) && value.length === 0)
        );
      });
    }
  }

  async enhanceResource(resource: Resource): Promise<Resource> {
    const fieldToCategoryMap: Record<string, ResourceType> = {
      characters: ResourceType.People,
      pilots: ResourceType.People,
      residents: ResourceType.People,
      people: ResourceType.People,
      films: ResourceType.Films,
      starships: ResourceType.Starships,
      vehicles: ResourceType.Vehicles,
      species: ResourceType.Species,
      planets: ResourceType.Planets,
      homeworld: ResourceType.Planets
    };
    
    const enriched: Resource = { ...resource };
  
    // Fetch image for characters (people) from Akabab API
    if (resource.type === 'people') {
      try {
        const response = await fetch(`https://akabab.github.io/starwars-api/api/id/${resource.id}.json`);
        const akabab = await response.json();
        enriched.image = akabab.image;
      } catch (e) {
        console.warn(`Failed to fetch Akabab image for ${resource.name}`);
      }
    }
  
    const referenceMap = new Map<string, { type: string; id: string }[]>();
  
    for (const [field, type] of Object.entries(fieldToCategoryMap)) {
      const value = resource[field];
      if (!value) continue;
    
      if (typeof value === 'string') {
        const id = this.extractIdFromUrl(value);
        if (id) referenceMap.set(field, [{ type, id }]);
      } else if (Array.isArray(value)) {
        const refs = value
          .filter(v => typeof v === 'string')
          .map(v => ({ type, id: this.extractIdFromUrl(v) }))
          .filter(ref => !!ref.id);
        if (refs.length > 0) referenceMap.set(field, refs);
      }
    }
    
  
    const groupedByCategory = new Map<string, Set<number>>();
  
    for (const refs of referenceMap.values()) {
      for (const { type, id } of refs) {
        const page = Math.floor((parseInt(id) - 1) / 10) + 1;
        if (!groupedByCategory.has(type)) {
          groupedByCategory.set(type, new Set());
        }
        groupedByCategory.get(type)!.add(page);
      }
    }
  
    const pageDataCache: Record<string, any[]> = {};
  
    for (const [type, pages] of groupedByCategory.entries()) {
      for (const page of pages) {
        try {
          const res = await fetch(`https://swapi.tech/api/${type}?page=${page}&limit=10`);
          const json = await res.json();
          const entries = json.results || json.result || [];
          pageDataCache[type] = [...(pageDataCache[type] || []), ...entries];
        } catch (err) {
          console.warn(`Failed to fetch ${type} page ${page}`);
        }
      }
    }
  
    for (const [field, refs] of referenceMap.entries()) {
      const type = refs[0]?.type;
      const data = pageDataCache[type] || [];
    
      const getName = (id: string) => {
        const match = data.find(item => item.uid === id);
        return match?.name || match?.properties?.title || '[Unknown]';
      };
    
      const original = resource[field];
    
      if (typeof original === 'string') {
        const id = this.extractIdFromUrl(original);
        enriched[field] = id ? getName(id) : original;
      } else if (Array.isArray(original)) {
        const names: string[] = [];
        for (const v of original) {
          const id = this.extractIdFromUrl(v);
          if (id) names.push(getName(id));
        }
        if (names.length > 0) enriched[field] = names.join(', ');
      }
    }
    
  
    return enriched;
  }
  
  extractIdFromUrl(url: string): string {
    const match = url.match(/\/(\d+)\/?$/);
    return match ? match[1] : '';
  }
  


  parseSwapiUrl(url: string): { category: string, id: string } {
    const match = url.match(/\/api\/(\w+)\/(\d+)/);
    return {
      category: match?.[1] || '',
      id: match?.[2] || ''
    };
  }
  
  
  

  formatKey(key: string): string {
    return key
      .replace(/_/g, ' ')                  
      .replace(/([a-z])([A-Z])/g, '$1 $2') 
      .replace(/\b\w/g, c => c.toUpperCase()); 
  }

  triggerClose() {
    this.isClosing = true;
    setTimeout(() => this.close.emit(), 300); 
  }
}
