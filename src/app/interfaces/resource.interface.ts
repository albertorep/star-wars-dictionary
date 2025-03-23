export enum ResourceType {
    People = 'people',
    Planets = 'planets',
    Films = 'films',
    Species = 'species',
    Vehicles = 'vehicles',
    Starships = 'starships'
}

export interface Resource {
    id: string;
    name: string;
    type: ResourceType;
    description?: string;
    [key: string]: any;
}