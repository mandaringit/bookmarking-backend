import { Router } from "express";
import {
  createReport,
  findMyReports,
  findReportById,
  removeReport,
} from "../controller/reports";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/", isAuthenticated, findMyReports);
router.post("/", isAuthenticated, createReport);
router.delete("/", isAuthenticated, removeReport);
router.get("/find", isAuthenticated, findReportById);

export default router;
