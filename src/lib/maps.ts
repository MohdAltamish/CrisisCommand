import { Loader } from '@googlemaps/js-api-loader';
import { CrisisType } from '@/types';

let loader: Loader | null = null;

export function getMapsLoader(): Loader {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['maps', 'marker'],
    });
  }
  return loader;
}

export const CRISIS_MAP_COLORS: Record<CrisisType, string> = {
  fire:       '#FF3B30',
  flood:      '#007AFF',
  earthquake: '#FF9500',
  medical:    '#34C759',
  stampede:   '#AF52DE',
};
