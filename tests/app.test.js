
const request = require("supertest");
const app = require("../server");

describe("Student Placement Management System", () => {
  test("Home page should load successfully", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain(
      "Student Placement Management System"
    );
  });

  test("Health endpoint should report healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
    expect(response.body.application).toBe(
      "student-placement-system"
    );
  });
});
