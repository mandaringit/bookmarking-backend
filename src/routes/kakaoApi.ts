import { Router } from "express";
import { searchBooks } from "../controller/kakaoApi";

const router = Router();

router.get("/", searchBooks);

export default router;
