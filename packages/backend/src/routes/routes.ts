import chatRouters from "./chat.routes";
import  express from "express";

const router = express.Router();

// ****** Chat Routes ******//
router.use("/chat", chatRouters);


export default router;