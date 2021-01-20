import { Router } from "express";
import { getBookExist } from "../controller/library";

const router = Router();

router.get("/", getBookExist);

export default router;
