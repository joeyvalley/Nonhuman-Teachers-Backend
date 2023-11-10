import Report from './model.js'
import User from './userModel.js'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nht.backend@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
});

export async function getReports(req, res) {
  try {
    const reports = await Report.find({ status: 'accepted' });
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
}

export async function postReport(req, res) {
  console.log(req.body);
  try {
    const newReport = new Report({
      first: req.body.fname,
      last: req.body.lname,
      email: req.body.email,
      dateOfTrip: req.body.date,
      category: req.body.category,
      subCategory: req.body.subcategory,
      details: req.body.details,
      dateCreated: req.body.dateCreated,
      status: req.body.status
    });
    const savedReport = await newReport.save();
    sendNotificationEmail();
    res.json(true);
  } catch (err) {
    res.json(false);
  }
}

function sendNotificationEmail() {
  const mailOptions = {
    from: 'nht.backend@gmail.com',
    to: 'info@nonhumanteachers.org',
    subject: 'New Experience Report Submitted',
    html: 'A new report has been submitted. Please <a href="https://nonhumanteachers.org/admin">review it</a>.'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

export async function authenticate(req, res) {
  const { username, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    // Look for the user by email
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // User matched, create a token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // payload
      JWT_SECRET,
      { expiresIn: '1h' } // token expiration
    );

    // Send the token to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function register(req, res) {
  try {
    // Create a new user instance
    const newUser = new User(req.body);

    // Save the new user to the database
    const user = await newUser.save();

    // Respond with the created user (excluding the password)
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    // If there's an error (e.g., user already exists), send an appropriate message
    console.error(error);
    if (error.code === 11000) { // Duplicate key error code
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Error creating user" });
  }
}

export async function getPendingReports(req, res) {
  try {
    const reports = await Report.find({ status: 'pending' });
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Failed to fetch reports.' });
  }
}

export async function verifyReport(req, res) {
  const { id, method } = req.body;
  try {
    const updatedReport = await Report.findByIdAndUpdate(id, { status: method }, { new: true });
    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(updatedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer TOKEN_VALUE
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }
      req.user = user;
      next(); // Token is good, proceed to the route
    });
  } else {
    res.sendStatus(401); // No token provided
  }
};