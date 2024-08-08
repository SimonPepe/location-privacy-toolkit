import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private url = 'http://giv-sitcomdev.uni-muenster.de:5000';
    private token: string = '';
    private socket: Socket = null!;

    constructor(private http: HttpClient) { }

    logServerAddress() {
        console.log(`Server address: ${this.url}`);
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.url}/api/login`, {
            username,
            password
        }).pipe(
            tap(response => {
                this.token = response.token;
            })
        );
    }

    getToken() {
        return this.token;
    }

    setToken(token: string) {
        this.token = token;
    }


    connectSocket(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = io(this.url);
    
            this.socket.on('connect', () => {
                console.log('connected');
                this.listenForState();
                resolve();  // Resolve the promise when connected
            });
    
            this.socket.on('disconnect', () => {
                console.log('disconnected');
            });
    
            this.socket.on('connect_error', (error) => {
                console.error('Connection error', error);
                reject(error);  // Reject the promise if there is a connection error
            });
        });
    }
    

    listenForState() {
        if (this.socket) {
            this.socket.on('/get/state', (currentState: any) => {
                console.log("State updated:", currentState);
            });
        }
    }

    // Emit an event to set the scenario
    setScenario(scenarioId: number, scenarioName: string) {
        this.socket.emit('/set/scenario', {
            "scenario_id": scenarioId,
            "scenario_name": scenarioName
        });
    }

    // Emit an event to set the location
    setLocation(locationId: number, locationType: string, locationName: string) {
        this.socket.emit('/set/location', {
            "location_id": locationId,
            "location_type": locationType,
            "location_name": locationName
        });
    }

    // Example API call method
    makeApiCall(data: any): Observable<any> {
        return this.http.post<any>(`${this.url}/api/data`, data, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }
}
