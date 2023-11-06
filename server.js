import './connection.js'

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

import { getReports, postReport, authenticate, register, getPendingReports, verifyReport, verifyToken } from './controller.js';

const app = express();
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const sanitizeMiddleware = (req, res, next) => {
  const { details } = req.body;
  if (details) {
    req.body.details = DOMPurify.sanitize(details)
  }
  next();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

// Report routes
app.get("/api/reports/", getReports);
app.post("/api/reports/", sanitizeMiddleware, postReport);

// Administration Routes
app.post("/api/login/", authenticate);
app.post("/api/register/", register);
app.get("/api/pending-reports/", verifyToken, getPendingReports)
app.post("/api/verify-report/", verifyToken, verifyReport)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 3000}`);
});