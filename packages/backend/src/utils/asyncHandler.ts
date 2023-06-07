import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const asyncHandler = (handler: ( request: Request, response: Response) => Promise<void>) => {
    return async (request: Request, response: Response) => {
        try {
            await handler(request, response);
        } catch (error: any) {
            if(error && error.statusCode) {
                response.status(error.statusCode).send(error);
                return;
            }
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        }
    }
}