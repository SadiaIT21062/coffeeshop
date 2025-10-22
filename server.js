// server.js 
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//  File paths 
const feedbackFile = "feedback.json";
const ordersFile = "orders.json";

//  Initialize files if missing 
if (!fs.existsSync(feedbackFile)) fs.writeFileSync(feedbackFile, "[]");
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, "[]");

//  Feedback Routes 
app.post("/feedback", (req, res) => {
  try {
    const feedbacks = JSON.parse(fs.readFileSync(feedbackFile));
    const newFeedback = {
      name: req.body.name || "Anonymous",
      email: req.body.email || "N/A",
      text: req.body.text,
      date: new Date().toLocaleString(),
    };

    feedbacks.push(newFeedback);
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));

    res.json({ message: "Feedback saved successfully!" });
  } catch (err) {
    console.error("Error saving feedback:", err);
    res.status(500).json({ message: "Error saving feedback" });
  }
});

app.get("/feedback", (req, res) => {
  try {
    const feedbacks = JSON.parse(fs.readFileSync(feedbackFile));
    res.json(feedbacks);
  } catch (err) {
    console.error("Error reading feedbacks:", err);
    res.status(500).json({ message: "Error loading feedbacks" });
  }
});

//  Order Routes
app.post("/order", (req, res) => {
  try {
    const newOrderItems = req.body;
    const oldOrders = fs.existsSync(ordersFile)
      ? JSON.parse(fs.readFileSync(ordersFile))
      : [];

    const newOrder = {
      items: newOrderItems,
      total: newOrderItems.reduce((sum, item) => sum + item.price, 0),
      date: new Date().toLocaleString(),
    };

    oldOrders.push(newOrder);
    fs.writeFileSync(ordersFile, JSON.stringify(oldOrders, null, 2));

    res.json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: "Error saving order" });
  }
});

app.get("/order", (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ordersFile));
    res.json(orders);
  } catch (err) {
    console.error("Error reading orders:", err);
    res.status(500).json({ message: "Error loading orders" });
  }
});

// Start server 
app.listen(PORT, () =>
  console.log(` Server running on http://localhost:${PORT}`)
);
