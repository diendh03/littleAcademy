import { Recipe } from '~/utils/interface/common';

// Mảng công thức
export const recipes: Recipe[] = [
  { id: 4, result: 'pressure', elements: { name1: 'air', name2: 'air' } },
  { id: 5, result: 'energy', elements: { name1: 'air', name2: 'fire' } },
  { id: 6, result: 'dust', elements: { name1: 'air', name2: 'earth' } },
  { id: 7, result: 'lava', elements: { name1: 'earth', name2: 'fire' } },
  { id: 8, result: 'rain', elements: { name1: 'air', name2: 'water' } },
  { id: 9, result: 'mud', elements: { name1: 'earth', name2: 'water' } },
  { id: 10, result: 'steam', elements: { name1: 'fire', name2: 'water' } },
  { id: 11, result: 'sea', elements: { name1: 'water', name2: 'water' } },
  { id: 12, result: 'wind', elements: { name1: 'air', name2: 'energy' } },
  { id: 13, result: 'stone', elements: { name1: 'air', name2: 'lava' } },
  { id: 14, result: 'atmosphere', elements: { name1: 'air', name2: 'pressure' } },
  { id: 15, result: 'cloud', elements: { name1: 'air', name2: 'steam' } },
  { id: 16, result: 'earthquake', elements: { name1: 'earth', name2: 'energy' } },
];
