import { Router } from "express";
import {
  authMiddleware,
  systemUserMiddleware,
} from "../middleware/auth.middleware.js";
import {
  createTransaction,
  createInitialFundsTransaction,
} from "../controllers/transaction.controller.js";

const transactionRouter = Router();

/**
 * - Post /api/transactions/
 * - Create a new transaction
 */

transactionRouter.post("/", authMiddleware, createTransaction);

/**
 * - Post /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRouter.post(
  "/system/initial-funds",
  systemUserMiddleware,
  createInitialFundsTransaction,
);

export default transactionRouter;
