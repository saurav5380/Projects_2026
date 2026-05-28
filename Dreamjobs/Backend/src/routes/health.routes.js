const { Router } = require("express");
const { query } = require("../config/db");

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    await query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
