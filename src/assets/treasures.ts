import { FeatureCollection, Point } from 'geojson'
import { TreasureProperties } from 'src/app/interfaces'

export const treasures: FeatureCollection<Point, TreasureProperties> = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "bogstav": "a"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.577564716339111,
          55.667940406235374
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "bogstav": "b"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.576497197151184,
          55.66745935379183
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "bogstav": "e"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          12.57591515779495,
          55.66709931696172
        ]
      }
    }
  ]
}
