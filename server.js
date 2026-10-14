
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let students = [
  { id: 1, name: "Rahul Sharma", course: "MCA", company: "TCS", status: "Selected" },
  { id: 2, name: "Priya Kumar", course: "MCA", company: "Infosys", status: "Interview" },
  { id: 3, name: "Arun Kumar", course: "MCA", company: "Wipro", status: "Applied" }
];

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Student Placement Management System</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f3f6fb;
      color: #1e293b;
    }
    header {
      background: #172554;
      color: white;
      padding: 24px;
    }
    header h1 { margin: 0 0 8px; font-size: 25px; }
    header p { margin: 0; color: #cbd5e1; }
    main { max-width: 1100px; margin: 28px auto; padding: 0 18px; }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .card, .panel {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px #0f172a0d;
    }
    .card p { color: #64748b; margin: 0 0 10px; }
    .card strong { font-size: 28px; }
    .panel { margin-bottom: 22px; }
    .toolbar, form {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }
    input, select, button {
      padding: 11px 12px;
      border-radius: 7px;
      border: 1px solid #cbd5e1;
      font-size: 14px;
    }
    input, select { flex: 1; min-width: 140px; }
    button {
      background: #1d4ed8;
      color: white;
      border: 0;
      cursor: pointer;
    }
    button:hover { background: #1e40af; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td {
      text-align: left;
      padding: 13px 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    th { color: #64748b; font-size: 13px; }
    .status { font-weight: bold; }
    .Selected { color: #15803d; }
    .Interview { color: #b45309; }
    .Applied { color: #1d4ed8; }
    .Rejected { color: #b91c1c; }
    #message { margin-top: 12px; }
    footer { text-align: center; color: #64748b; padding: 22px; }
  </style>
</head>
<body>
  <header>
    <h1>Student Placement Management System</h1>
    <p>Track applications, interviews and placement outcomes.</p>
  </header>

  <main>
    <section class="stats">
      <div class="card"><p>Total Students</p><strong id="total">0</strong></div>
      <div class="card"><p>Selected</p><strong id="selected">0</strong></div>
      <div class="card"><p>Interviews</p><strong id="interviews">0</strong></div>
      <div class="card"><p>Applications</p><strong id="applied">0</strong></div>
    </section>

    <section class="panel">
      <h2>Add Student Placement</h2>
      <form id="studentForm">
        <input name="name" placeholder="Student name" required>
        <input name="course" placeholder="Course (e.g. MCA)" required>
        <input name="company" placeholder="Company" required>
        <select name="status" required>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit">Add Student</button>
      </form>
      <p id="message" role="status"></p>
    </section>

    <section class="panel">
      <h2>Placement Records</h2>
      <div class="toolbar">
        <input id="search" placeholder="Search name or company">
        <select id="filter">
          <option value="All">All statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Course</th><th>Company</th><th>Status</th></tr></thead>
          <tbody id="studentRows"></tbody>
        </table>
      </div>
    </section>
  </main>
  <footer>Student Placement Management System · Powered by Node.js and Express</footer>

  <script>
    let students = [];

    async function loadStudents() {
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Unable to load students");
      students = await response.json();
      renderStudents();
    }

    function renderStudents() {
      const query = document.getElementById("search").value.toLowerCase();
      const status = document.getElementById("filter").value;

      document.getElementById("total").textContent = students.length;
      document.getElementById("selected").textContent =
        students.filter(s => s.status === "Selected").length;
      document.getElementById("interviews").textContent =
        students.filter(s => s.status === "Interview").length;
      document.getElementById("applied").textContent =
        students.filter(s => s.status === "Applied").length;

      const filtered = students.filter(s =>
        (s.name + " " + s.company).toLowerCase().includes(query) &&
        (status === "All" || s.status === status)
      );

      const rows = document.getElementById("studentRows");
      rows.replaceChildren();

      filtered.forEach(student => {
        const tr = document.createElement("tr");
        [student.id, student.name, student.course, student.company].forEach(value => {
          const td = document.createElement("td");
          td.textContent = value;
          tr.appendChild(td);
        });

        const statusCell = document.createElement("td");
        statusCell.textContent = student.status;
        statusCell.className = "status " + student.status;
        tr.appendChild(statusCell);
        rows.appendChild(tr);
      });

      if (filtered.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "No matching student records.";
        tr.appendChild(td);
        rows.appendChild(tr);
      }
    }

    document.getElementById("search").addEventListener("input", renderStudents);
    document.getElementById("filter").addEventListener("change", renderStudents);

    document.getElementById("studentForm").addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = Object.fromEntries(new FormData(form));
      const message = document.getElementById("message");

      try {
        const response = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not add student");

        form.reset();
        message.textContent = "Student added successfully.";
        await loadStudents();
      } catch (error) {
        message.textContent = error.message;
      }
    });

    loadStudents().catch(error => {
      document.getElementById("message").textContent = error.message;
    });
  </script>
</body>
</html>`);
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    application: "student-placement-system"
  });
});

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.post("/api/students", (req, res) => {
  const { name, course, company, status } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof course !== "string" || !course.trim() ||
    typeof company !== "string" || !company.trim() ||
    !["Applied", "Interview", "Selected", "Rejected"].includes(status)
  ) {
    return res.status(400).json({
      error: "Provide a valid name, course, company and placement status."
    });
  }

  const student = {
    id: Date.now(),
    name: name.trim(),
    course: course.trim(),
    company: company.trim(),
    status
  };

  students.push(student);
  res.status(201).json(student);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
  });
}

module.exports = app;
