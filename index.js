const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const pool = require("./db");

// middleware
app.use(express.json()); // req. body

const corsOptions = {
  origin: ["http://localhost:3000", "https://zen-date-client.vercel.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, //
};

app.use(cors(corsOptions));

// ROUTES

// Add a Date
app.post("/dates", async (req, res) => {
  try {
    const { name, event_date, relationship, event_type, mobile_number } =
      req.body;
    const newDate = await pool.query(
      "INSERT INTO dates (name, event_date, event_type, mobile_number) VALUES($1, $2, $3, $4) RETURNING *",
      [name, event_date, event_type, mobile_number]
    );

    if (newDate.rows.length > 0) {
      res.json(newDate.rows[0]);
    } else {
      res.status(400).json({ error: "Failed to insert data." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// get all Dates
app.get("/dates", async (req, res) => {
  try {
    const allDates = await pool.query("SELECT * FROM dates");
    res.json(allDates.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// get a date
app.get("/dates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const date = await pool.query("SELECT * FROM dates WHERE date_id = $1", [
      id,
    ]);

    res.json(date.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// update a date
app.put("/dates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, event_date, event_type, mobile_number } = req.body;

    const updatedDate = await pool.query(
      "UPDATE dates SET name = $1, event_date = $2, event_type = $3, mobile_number = $4 WHERE date_id = $5",
      [name, event_date, event_type, mobile_number, id]
    );

    if (updatedDate.rowCount > 0) {
      res.json("Date was updated!");
    } else {
      res.status(404).json({ error: "Date not found" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// delete a dates
app.delete("/dates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedate = await pool.query(
      "DELETE FROM dates WHERE date_id = $1",
      [id]
    );
    res.json("date was deleted!");
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
