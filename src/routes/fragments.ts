import { Router } from "express";
import { createFragment } from "../controller/fragments";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.post("/", isAuthenticated, createFragment);

export default router;
