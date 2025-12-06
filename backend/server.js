const jsonServer = require("json-server");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

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
server.get("/session-start", (req, res) => {
  console.log("session start called");
  const onboardingId = uuidv4();
  const sessionToken = uuidv4();

  router.db
    .set("sessions", { [sessionToken]: { onboardingId } })
    .set(`onboardings.${onboardingId}`, { step: "email" })
    .write();

  setCookie(res, "session_token", sessionToken);
  res.jsonp({ onboardingId });
});

// ── 2. Send OTP ──────────────────────────────────────────────────────────
server.post("/send-otp", (req, res) => {
  const sessionToken = req.cookies?.session_token;
  const { onboardingId } = req.query;
  const { email } = req.body;

  if (!sessionToken || !onboardingId || !email) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  // Simulate sending OTP
  const otp = "123456"; // in real mock you could randomize
  router.db
    .set(`onboardings.${onboardingId}`, {
      ...router.db.get(`onboardings.${onboardingId}`).value(),
      email,
      otp,
      step: "verify-otp",
    })
    .write();

  res.json({ success: true, message: `OTP sent to ${email}` });
});

// ── 3. Verify OTP ────────────────────────────────────────────────────────
server.post("/verify-otp", (req, res) => {
  const { onboardingId } = req.query;
  const { email, otp } = req.body;
  const sessionToken = req.cookies?.session_token;

  if (!sessionToken || !onboardingId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const onboarding = router.db.get(`onboardings.${onboardingId}`).value();

  if (!onboarding || onboarding.email !== email || onboarding.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  const authToken = uuidv4();
  setCookie(res, "auth_token", authToken);

  router.db
    .set(`onboardings.${onboardingId}`, { ...onboarding, step: "csv-upload" })
    .write();

  res.json({ success: true, message: "Email verified" });
});

// ── 4. CSV Upload (multipart/form-data) ───────────────────────────────────
server.put("/csv-upload", upload.single("file"), (req, res) => {
  const { onboardingId } = req.query;
  const sessionToken = req.cookies?.session_token;
  const authToken = req.cookies?.auth_token;

  if (!sessionToken || !authToken || !onboardingId || !req.file) {
    return res.status(400).json({ success: false, message: "Bad request" });
  }

  // Just pretend we processed the CSV
  router.db
    .set(`onboardings.${onboardingId}`, {
      ...router.db.get(`onboardings.${onboardingId}`).value(),
      csvUploaded: true,
      step: "business-logic",
    })
    .write();

  res.json({ success: true, message: "CSV uploaded and processed" });
});

// ── 5. Get Started (after CSV) ───────────────────────────────────────────
server.post("/get-started", (req, res) => {
  const { onboardingId } = req.query;
  const authToken = req.cookies?.auth_token;

  if (!authToken || !onboardingId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const onboarding = router.db.get(`onboardings.${onboardingId}`).value();
  if (!onboarding?.csvUploaded) {
    return res
      .status(400)
      .json({ success: false, message: "CSV not uploaded yet" });
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
server.post("/confirm-business", (req, res) => {
  const { onboardingId } = req.query;
  const authToken = req.cookies?.auth_token;
  const businessLogic = req.body;

  if (!authToken || !onboardingId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  router.db
    .set(`onboardings.${onboardingId}`, {
      ...router.db.get(`onboardings.${onboardingId}`).value(),
      businessLogic,
      step: "completed",
    })
    .write();

  res.json({ success: true, message: "Business logic confirmed" });
});

// ── 7. Complete Onboarding ──────────────────────────────────────────────
server.put("/complete-onboarding", (req, res) => {
  const { onboardingId } = req.query;
  const authToken = req.cookies?.auth_token;

  if (!authToken || !onboardingId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const onboarding = router.db.get(`onboardings.${onboardingId}`).value();
  if (onboarding?.step !== "completed") {
    return res
      .status(400)
      .json({ success: false, message: "Previous steps not finished" });
  }

  // In real app you would create user, client, etc.
  res.json({ success: true, message: "Onboarding completed successfully!" });
});

// Use lowdb router
server.use(router);

module.exports = server;
