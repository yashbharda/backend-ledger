import Account from "../models/account.model.js";
import Transaction from "../models/transaction.model.js";
import Ledger from "../models/ledger.model.js";
import emailService from "../services/email.service.js";
import mongoose from "mongoose";

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account stauts
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create Debit ledger entry
 * 7. Create Credit ledger entry
 * 8. Mark transaction as COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

async function createTransaction(req, res) {
  /**
   * Step 1: Validate request
   */
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "From account, to account, amount, and idempotency key are required",
    });
  }

  const fromUserAccount = await Account.findOne({ _id: fromAccount });

  const toUserAccount = await Account.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: "Invalid from or to account",
    });
  }

  /**
   * Step 2: Validate idempotency key
   */

  const isTransactionAlreadyExists = await Transaction.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: isTransactionAlreadyExists,
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still processing",
      });
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        message: "Previous Transaction failed",
      });
    }

    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(500).json({
        message: "Previous Transaction was reversed",
      });
    }
  }

  /**
   * Step 3: Check account status
   */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "Both accounts must be active to perform a transaction",
    });
  }

  /**
   * Step 4: Derive sender balance from ledger
   */
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}.`,
    });
  }

  let transaction;
  const session = await mongoose.startSession();
  try {
    /**
     * Step 5: Create transaction (PENDING)
     */

    session.startTransaction();

    transaction = (
      await Transaction.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const [debitLedgerEntry] = await Ledger.create(
      [
        {
          account: fromAccount,
          amount: amount,
          type: "DEBIT",
          transaction: transaction._id,
        },
      ],
      { session },
    );

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    })();

    const [creditLedgerEntry] = await Ledger.create(
      [
        {
          account: toAccount,
          amount: amount,
          type: "CREDIT",
          transaction: transaction._id,
        },
      ],
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.error("Transaction Error:", error);

    await session.abortTransaction();

    return res.status(500).json({
      message:
        "Transaction is Pending due to some issue. Please try again later.",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }

  /**
   * Step 10: Send email notification
   */

  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    fromAccount,
    toAccount,
  );

  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "To account, amount, and idempotency key are required",
    });
  }

  const toUserAccount = await Account.findOne({ _id: toAccount });

  if (!toUserAccount) {
    return res.status(404).json({
      message: "Invalid to account",
    });
  }

  const fromUserAccount = await Account.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(404).json({
      message: "System user account not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new Transaction({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await Ledger.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        type: "DEBIT",
        transaction: transaction._id,
      },
    ],
    { session },
  );

  const creditLedgerEntry = await Ledger.create(
    [
      {
        account: toAccount,
        amount: amount,
        type: "CREDIT",
        transaction: transaction._id,
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction,
  });
}

export { createTransaction, createInitialFundsTransaction };
