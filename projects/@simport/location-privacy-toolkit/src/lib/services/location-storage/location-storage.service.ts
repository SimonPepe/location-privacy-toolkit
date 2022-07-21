import { Injectable } from '@angular/core'
import { Position } from '@capacitor/geolocation'
import { DatabaseService } from './database/database.service'

@Injectable({
  providedIn: 'root',
})
export class LocationStorageService {
  constructor(private databaseService: DatabaseService) {}

  async getAllLocations(): Promise<Position[]> {
    // TODO: return real data
    var locations: Position[] = []
    for (let index = 0; index < 200; index++) {
      locations.push(this.generateRandomPosition())
    }
    return locations.sort((a, b) => a.timestamp - b.timestamp)
  }

  async getLocations(fromDate: Date, toDate: Date): Promise<Position[]> {
    // TODO: return real data
    return [
      this.generateRandomPosition(),
      this.generateRandomPosition(),
      this.generateRandomPosition(),
    ]
  }

  async deleteLocation(location: Position) {
    // TODO: delete location
  }

  private generateRandomPosition(): Position {
    return {
      timestamp: Math.random() * Date.now(),
      coords: {
        latitude: Math.random() * 2 + 51,
        longitude: Math.random() * 2 + 7,
        accuracy: Math.random() * 100,
        altitudeAccuracy: Math.random() * 100,
        altitude: Math.random() * 100,
        speed: Math.random() * 100,
        heading: Math.random() * 360,
      },
    }
  }
}
