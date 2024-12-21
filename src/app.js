const express = require("express");
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const Subs = require("./models/subscribers");
const data = require("./data");
const app = express();
// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "YouTube Subscribers API",
      version: "1.0.0",
      description: "API documentation for managing YouTube subscribers",
      contact: {
        name: "Vikesh Raut",
        email: "vikeshraut952@gmail.com",
        url: "https://github.com/",
      },
    },
    servers: [
      {
        url: "https://youtube-subscribers-project-d7nf.onrender.com/",
        description: "Live server",
      },
      {
        url: "http://localhost:3200/",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/**/*.js"], // Path to API documentation
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger route
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/add", async (req, res) => {
  try {
    await Subs.deleteMany(); // Delete previous data from database
    const output = await Subs.insertMany(data); // Insert data to database
    console.log(output);
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /subscribers:
 *   get:
 *     summary: Get all subscribers
 *     tags: [Subscribers]
 *     responses:
 *       200:
 *         description: Successfully fetched all subscribers.
 *       500:
 *         description: Server error.
 */
app.get("/subscribers", async (req, res) => {
  try {
    const data = await Subs.find(); // Find all subscribers
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /subscribers/name:
 *   get:
 *     summary: Get subscribers by name and subscribed channel
 *     tags: [Subscribers]
 *     responses:
 *       200:
 *         description: Successfully fetched subscribers.
 *       500:
 *         description: Server error.
 */
app.get("/subscribers/name", async (req, res) => {
  try {
    const data = await Subs.find({}, { _id: 0, name: 1, subscribedChannel: 1 });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /subscribers/{id}:
 *   get:
 *     summary: Get a subscriber by ID
 *     tags: [Subscribers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subscriber
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched subscriber.
 *       404:
 *         description: Subscriber not found.
 *       500:
 *         description: Server error.
 */
app.get("/subscribers/:id", async (req, res) => {
  try {
    const data = await Subs.findById(req.params.id); // Find subscriber by ID
    if (!data) {
      res.status(404).json({ message: "Subscriber not found." });
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = app;
