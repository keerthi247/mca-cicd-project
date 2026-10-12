
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Student Placement Management System</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f0f4f8;
          text-align: center;
          padding: 60px 20px;
        }
        .card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 550px;
          margin: auto;
        }
        h1 { color: #174ea6; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Student Placement Management System</h1>
        <p>Welcome to my MCA project!</p>
        <p>My first Node.js web server is running.</p>
      </div>
    </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    application: "student-placement-system"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
