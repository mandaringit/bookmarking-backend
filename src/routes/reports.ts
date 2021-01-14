import { Router } from "express";
import {
  createReport,
  findMyReports,
  findReportById,
  removeReport,
  updateReportTitle,
} from "../controller/reports";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/", isAuthenticated, findMyReports);
router.post("/", isAuthenticated, createReport);
router.delete("/", isAuthenticated, removeReport);
router.get("/find", isAuthenticated, findReportById);
router.patch("/", isAuthenticated, updateReportTitle);

export default router;
