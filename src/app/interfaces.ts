import { Feature, FeatureCollection, Point } from 'geojson';

export type RouteNames = 'Jack Sparrow' |
  'Kaptajn Klo' |
  'Sortskæg' |
  'Kløvedal' |
  'Knud Rasmussen' |
  'Napoleon' |
  'Kaptajn Haddock' |
  'Kaptajn Skæg'

export interface TreasureProperties {
  bogstav: string;
  fid?: number;
}

export interface RouteViewModel {
  name: string;
  route: string;
  color: string;
}

export interface TreasureRoute {
  name: RouteNames;
  color: string;
  treasures: Feature<Point, TreasureProperties>[]
};
