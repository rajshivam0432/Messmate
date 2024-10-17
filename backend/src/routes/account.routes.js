import express from "express";
import Account from "../models/account.model.js";
import Rebate from "../models/rebate.model.js";

const router = express.Router();

router.get("/:user/:month", async (req, res) => {
  try {
    const { user, month } = req.params;
    console.log("user from account .routes", user, month);
    const monthIndex = parseInt(month);
    console.log("monthIndex", monthIndex);
    const startOfMonth = new Date(new Date().getFullYear(), monthIndex - 1, 1);
    const endOfMonth = new Date(new Date().getFullYear(), monthIndex, 0);

    // Fetch account details for the user for the specific month
    let account = await Account.findOne({ user, month: monthIndex });
    console.log("account", account);
    if (!account) {
      account = new Account({
        user,
        balance: 34000,
        month: monthIndex,
        year: new Date().getFullYear(),
        daysAttended: 30,
        dietCharges: 30,
        miscellaneousCharges: 1200,
        extraCharges: 200,
        rebateAmount: 0,
        adjustedMealCost: 0,
      });
    }

    // Fetch rebate information for the selected month
    const rebate = await Rebate.findOne({
      user,
      dateFrom: { $lte: endOfMonth },
      dateTo: { $gte: startOfMonth },
    }).lean();
    console.log("rebate", rebate);
    let rebateAmount = 0;
    let adjustedMealCost = 0;

    if (rebate) {
      // Calculate rebate days
      const start = new Date(
        Math.max(rebate.dateFrom.getTime(), startOfMonth.getTime())
      );
      console.log("start", start);
      const end = new Date(
        Math.min(rebate.dateTo.getTime(), endOfMonth.getTime())
      );
      console.log("end", end);
      const rebateDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      console.log("rebateDays", rebateDays);
      const dailyMealCost = 30;
      const totalDaysInMonth = new Date(
        new Date().getFullYear(),
        monthIndex,
        0
      ).getDate();
      const totalMealCost = totalDaysInMonth * dailyMealCost;
      rebateAmount = rebateDays * dailyMealCost;
      console.log("rebateAmount", rebateAmount);
      adjustedMealCost = totalMealCost - rebateAmount;
      console.log("adjustedMealCost", adjustedMealCost);

      account.daysAttended = Math.max(0, account.daysAttended - rebateDays);
    } else {
      const dailyMealCost = 30;
      const totalDaysInMonth = new Date(
        new Date().getFullYear(),
        monthIndex,
        0
      ).getDate();
      adjustedMealCost = totalDaysInMonth * dailyMealCost;
    }

    account.rebateAmount = rebateAmount;
    account.adjustedMealCost = adjustedMealCost;
    account.balance -=
      adjustedMealCost + account.miscellaneousCharges + account.extraCharges;

    await account.save();

    res.json({
      ...account._doc,
      rebateAmount,
      adjustedMealCost,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST account details
router.post("/", async (req, res) => {
  const {
    user,
    month,
    balance,
    year,
    daysAttended,
    dietCharges,
    miscellaneousCharges,
    extraCharges,
    rebateAmount,
    adjustedMealCost,
  } = req.body;

  try {
    let account = await Account.findOne({ user, month });

    if (account) {
      // Update existing account
      account.balance = balance;
      account.year = year;
      account.daysAttended = daysAttended;
      account.dietCharges = dietCharges;
      account.miscellaneousCharges = miscellaneousCharges;
      account.extraCharges = extraCharges;
      account.rebateAmount = rebateAmount;
      account.adjustedMealCost = adjustedMealCost;
    } else {
      // Create new account entry
      account = new Account({
        user,
        balance,
        month,
        year,
        daysAttended,
        dietCharges,
        miscellaneousCharges,
        extraCharges,
        rebateAmount,
        adjustedMealCost,
      });
    }

    await account.save();
    res.status(200).json(account);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
