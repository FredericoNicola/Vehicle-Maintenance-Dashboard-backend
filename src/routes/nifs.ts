import express from "express";
import axios from "axios";

const router = express.Router();

// Proxy NIF info from nif.pt
router.get("/:nif", async (req, res) => {
  try {
    const { nif } = req.params;
    const response = await axios.get(`https://www.nif.pt/${nif}/`, {
      responseType: "text",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Failed to fetch NIF info");
    console.error("Error fetching NIF info:", err);
  }
});

export default router;
