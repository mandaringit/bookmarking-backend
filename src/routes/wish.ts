import { Router } from "express";
import {
  createWish,
  findMyWishes,
  findMyWishesWithLibrary,
  removeWish,
} from "../controller/wish";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.get("/", isAuthenticated, findMyWishes);
router.get("/library", isAuthenticated, findMyWishesWithLibrary);
router.post("/", isAuthenticated, createWish);
router.delete("/", isAuthenticated, removeWish);

export default router;
