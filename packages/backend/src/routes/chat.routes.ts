

import express from "express";
import { chatWithOpenAI } from "../controllers/chatController";
import { asyncHandler } from "../utils";

const userRouter = express.Router();
userRouter.post(
    "/", 
    asyncHandler(chatWithOpenAI) 
);
export default userRouter;
    
