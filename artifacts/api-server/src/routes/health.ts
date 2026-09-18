import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const healthCheck = (_req: unknown, res: Parameters<IRouter["get"]>[1]) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
};

router.get("/health", healthCheck);
router.get("/healthz", healthCheck);

export default router;
