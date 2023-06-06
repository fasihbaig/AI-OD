import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() {}


    public setSessionId(force?: boolean) {
        const sessionId = window.localStorage.getItem("sessionId");
        if(!sessionId) {
            window.localStorage.setItem("sessionId", this.randomSessionId())
        }
        if(sessionId && force) {
            window.localStorage.setItem("sessionId", this.randomSessionId())
        }
    }

    public getSessionId(): string | null {
        return window.localStorage.getItem("sessionId") || null
    }

    private randomSessionId() {
        return `${Math.floor(Math.random() * 100000)}${new Date().getTime()}`
    }

    
}