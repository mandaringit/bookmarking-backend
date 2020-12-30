import { Router } from "express";
import { searchBooks } from "../controller/naverApi";

const router = Router();

router.get("/", searchBooks);

export default router;
