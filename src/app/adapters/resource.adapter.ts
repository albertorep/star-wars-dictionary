import { Resource, ResourceType } from '../interfaces/resource.interface';

export function adaptResource(item: any, type: ResourceType): Resource {
  const id = extractIdFromUrl(item.url);
  const name = item.name || item.title || 'Unknown';
  const description = generateDescription(item, type);

  return {
    id,
    name,
    type,
    description,
    ...item // Include everything else for flexibility
  };
}

function extractIdFromUrl(url: string): string {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
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
