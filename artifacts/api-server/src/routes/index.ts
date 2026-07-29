import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pavilionsRouter from "./pavilions";
import restaurantsRouter from "./restaurants";
import queueRouter from "./queue";
import interestsRouter from "./interests";
import geminiRouter from "./gemini";

const router: IRouter = Router();

router.use(healthRouter);
router.use(pavilionsRouter);
router.use(restaurantsRouter);
router.use(queueRouter);
router.use(interestsRouter);
router.use(geminiRouter);

export default router;
