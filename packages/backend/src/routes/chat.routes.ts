

import express from "express";
import { chatWithOpenAI } from "../controllers/chatController";

const userRouter = express.Router();
userRouter.post(
    "/", chatWithOpenAI
);
export default userRouter;
    
