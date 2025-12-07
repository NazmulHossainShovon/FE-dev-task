const express = require("express");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const app = express();
const dbPath = path.join(__dirname, "db.json");

// Helper function to read database
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { sessions: {}, onboardings: {}, uploads: {} };
  }
};

// Helper function to write database
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  // Allow requests from Docker containers and development
  if (allowedOrigins.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// ── Cookie helper ─────────────────────────────────────
const setCookie = (res, name, value, maxAge = 60 * 60 * 24 * 30) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: maxAge * 1000,
    path: "/",
  });
};

// ── Multer for CSV upload (stores in memory for mock) ─────────────────────
const upload = multer({ storage: multer.memoryStorage() });

// ── 1. Start Session ─────────────────────────────────────────────────────
app.get("/api/v1/session/start", (req, res) => {
  const onboardingId = uuidv4();
  const sessionToken = uuidv4();

  const db = readDB();
  db.sessions[sessionToken] = { onboardingId };
  db.onboardings[onboardingId] = { step: "email" };
  writeDB(db);

  setCookie(res, "session_token", sessionToken);
  res.json({ onboardingId });
});

// ── 2. Send OTP ──────────────────────────────────────────────────────────
app.post("/api/v1/user-verification/send-otp", (req, res) => {
  const sessionToken = req.cookies?.session_token;
  const { onboardingId } = req.query;
  const { email } = req.body;

  if (!sessionToken || !onboardingId || !email) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  // Simulate sending OTP
  const otp = "123456";
  const db = readDB();
  db.onboardings[onboardingId] = {
    ...db.onboardings[onboardingId],
    email,
    otp,
    step: "verify-otp",
  };
  writeDB(db);

  res.json({ success: true, message: `OTP sent to ${email}` });
});

// ── 3. Verify OTP ────────────────────────────────────────────────────────
app.post("/api/v1/user-verification/verify-otp", (req, res) => {
  const { onboardingId } = req.query;
  const { email, otp } = req.body;
  const sessionToken = req.cookies?.session_token;

  if (!sessionToken || !onboardingId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const db = readDB();
  const onboarding = db.onboardings[onboardingId];

  if (!onboarding || onboarding.email !== email || onboarding.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  const authToken = uuidv4();
  setCookie(res, "auth_token", authToken);

  db.onboardings[onboardingId] = { ...onboarding, step: "csv-upload" };
  writeDB(db);

  res.json({ success: true, message: "Email verified" });
});

// ── 4. CSV Upload (multipart/form-data) ───────────────────────────────────
app.put(
  "/api/v1/business-logic/csv-upload",
  upload.single("file"),
  (req, res) => {
    const { onboardingId } = req.query;
    const sessionToken = req.cookies?.session_token;
    const authToken = req.cookies?.auth_token;

    if (!sessionToken || !authToken || !onboardingId || !req.file) {
      return res.status(400).json({ success: false, message: "Bad request" });
    }

    // Just pretend we processed the CSV
    const db = readDB();
    db.onboardings[onboardingId] = {
      ...db.onboardings[onboardingId],
      csvUploaded: true,
      step: "business-logic",
    };
    writeDB(db);

    res.json({ success: true, message: "CSV uploaded and processed" });
  }
);

// ── 5. Get Started (after CSV) ───────────────────────────────────────────
app.post("/api/v1/business-logic/get-started", (req, res) => {
  const { onboardingId } = req.query;
  const authToken = req.cookies?.auth_token;

  if (!authToken || !onboardingId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Return dummy business logic so frontend can edit
  const dummyBusinessLogic = {
    own_brand: {
      name: "My Awesome Brand",
      domain: "myawesomebrand.com",
      brand_name_variations: ["MyAwesome", "AwesomeBrand"],
    },
    competitor_brands: [
      {
        name: "Competitor One",
        domain: "comp1.com",
        brand_name_variations: [],
      },
    ],
  };

  res.json(dummyBusinessLogic);
});

// ── 6. Confirm Business Logic ───────────────────────────────────────────
app.post("/api/v1/business-logic/confirm", (req, res) => {
  const { onboardingId } = req.query;
  const authToken = req.cookies?.auth_token;
  const businessLogic = req.body;

  if (!authToken || !onboardingId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const db = readDB();
  db.onboardings[onboardingId] = {
    ...db.onboardings[onboardingId],
    businessLogic,
    step: "completed",
  };
  writeDB(db);

  res.json({ success: true, message: "Business logic confirmed" });
});

// ── 7. Complete Onboarding ──────────────────────────────────────────────
app.put("/api/v1/complete-onboarding", (req, res) => {
  const { onboardingId } = req.query;
  const authToken = req.cookies?.auth_token;

  if (!authToken || !onboardingId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const db = readDB();
  const onboarding = db.onboardings[onboardingId];
  if (onboarding?.step !== "completed") {
    return res
      .status(400)
      .json({ success: false, message: "Previous steps not finished" });
  }

  res.json({ success: true, message: "Onboarding completed successfully!" });
});

// Generic JSON DB routes for direct access to db.json data
app.get("/api/db/:resource", (req, res) => {
  const { resource } = req.params;
  const db = readDB();

  if (!db[resource]) {
    return res.status(404).json({ error: "Resource not found" });
  }

  res.json(db[resource]);
});

app.get("/api/db/:resource/:id", (req, res) => {
  const { resource, id } = req.params;
  const db = readDB();

  if (!db[resource] || !db[resource][id]) {
    return res.status(404).json({ error: "Resource or item not found" });
  }

  res.json(db[resource][id]);
});

app.post("/api/db/:resource", (req, res) => {
  const { resource } = req.params;
  const db = readDB();

  if (!db[resource]) {
    db[resource] = {};
  }

  const id = uuidv4();
  db[resource][id] = { id, ...req.body };
  writeDB(db);

  res.status(201).json(db[resource][id]);
});

app.put("/api/db/:resource/:id", (req, res) => {
  const { resource, id } = req.params;
  const db = readDB();

  if (!db[resource]) {
    db[resource] = {};
  }

  db[resource][id] = { id, ...req.body };
  writeDB(db);

  res.json(db[resource][id]);
});

app.delete("/api/db/:resource/:id", (req, res) => {
  const { resource, id } = req.params;
  const db = readDB();

  if (!db[resource] || !db[resource][id]) {
    return res.status(404).json({ error: "Resource or item not found" });
  }

  delete db[resource][id];
  writeDB(db);

  res.status(204).send();
});

// Start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Express Server is running on port ${PORT}`);
    console.log(`Custom API routes available at /api/v1/*`);
    console.log(`JSON DB routes available at /api/db/*`);
  });
}

module.exports = app;
