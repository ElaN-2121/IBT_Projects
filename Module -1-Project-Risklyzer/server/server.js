require('dotenv').config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

const authRoutes = require('./routes/authRoute');
const vulnRoutes = require('./routes/vulnRoute');
const incidentRoutes = require("./routes/incidentRoute");

const phishingRoutes = require("./routes/phishRoute");
const attributionRoutes = require("./routes/attributionRoute");


const app = express();
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/vulns", vulnRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/phishing", phishingRoutes);
app.use("/api/attribution", attributionRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
};

startServer();