import { Router } from "express";
import {
  createReport,
  findMyReports,
  findReportById,
} from "../controller/reports";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/", isAuthenticated, findMyReports);
router.post("/", isAuthenticated, createReport);
router.get("/find", isAuthenticated, findReportById);

export default router;
