import { Router } from "express";
import { createReport, findMyReports } from "../controller/reports";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/", isAuthenticated, findMyReports);
router.post("/", isAuthenticated, createReport);

export default router;
