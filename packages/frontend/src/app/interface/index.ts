import { ErrorHandler } from "@angular/core"

export interface Error {
    [index: string]: string | number,
    message: string,
}