import { Resource, ResourceType } from '../interfaces/resource.interface';

export function adaptResource(data: any, type: ResourceType, id: string): Resource {
  const name = data.name || data.title || 'Unknown';
  const description = generateDescription(data, type);

  return {
    id,
    name,
    type,
    description,
    ...data
  };
}

function generateDescription(item: any, type: ResourceType): string {
  switch (type) {
    case ResourceType.People:
      return `${item.gender || 'Unknown'} • ${item.birth_year || 'No birth year'}`;
    case ResourceType.Planets:
      return `${item.climate || 'Unknown climate'} • ${item.terrain || 'Unknown terrain'}`;
    case ResourceType.Films:
      return `${item.director || 'Unknown director'} • ${item.release_date || 'Unknown date'}`;
    default:
      return '';
  }
}
