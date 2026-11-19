import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import accountController from "../controllers/account.controller.js";

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create new account
 * - Protected Route
 */
router.post("/", authMiddleware, accountController.createAccountController);

/**
 * - GET /api/accounts/
 * - Get all accounts
 * - Protected Route
 */
router.get("/", authMiddleware, accountController.getUserAccountsController);

/**
 * - GET /api/accounts/balance/:accountId
 * - Get account balance
 * - Protected Route
 */
router.get(
  "/balance/:accountId",
  authMiddleware,
  accountController.getAccountBalanceController,
);

export default router;
