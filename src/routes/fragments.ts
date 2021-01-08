import { Router } from "express";
import { createFragment, removeFragment } from "../controller/fragments";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.post("/", isAuthenticated, createFragment);
router.delete("/", isAuthenticated, removeFragment);

export default router;
