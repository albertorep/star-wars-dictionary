import { Resource, ResourceType } from '../interfaces/resource.interface';

export function adaptResource(data: any, type: ResourceType, id: string): Resource {
  const name = data.name || data.title || 'Unknown';
  const description = generateDescription(data, type);
  let image: string | undefined;
  if (type === ResourceType.Films && filmPosterMap[id]) {
    image = filmPosterMap[id];
  }

  return {
    id,
    name,
    type,
    description,
    image,
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

const filmPosterMap: Record<string, string> = {
  '1': '/assets/posters/Star_Wars_Episode_1_Poster.jpg',
  '2': '/assets/posters/Star_Wars_Episode_2_Poster.jpg',
  '3': '/assets/posters/Star_Wars_Episode_3_Poster.jpg',
  '4': '/assets/posters/Star_Wars_Episode_4_Poster.jpg',
  '5': '/assets/posters/Star_Wars_Episode_5_Poster.jpg',
  '6': '/assets/posters/Star_Wars_Episode_6_Poster.jpg'
};

