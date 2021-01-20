import { Router } from "express";
import {
  createReport,
  findMyReports,
  findMyReportsWithLibrary,
  findReportById,
  removeReport,
  updateReportTitle,
} from "../controller/reports";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/", isAuthenticated, findMyReports);
router.get("/library", isAuthenticated, findMyReportsWithLibrary);
router.get("/find", isAuthenticated, findReportById);
router.post("/", isAuthenticated, createReport);
router.delete("/", isAuthenticated, removeReport);
router.patch("/", isAuthenticated, updateReportTitle);

export default router;
