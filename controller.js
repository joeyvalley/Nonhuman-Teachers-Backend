import Report from './model.js'

export async function post(req, res) {
  console.log(req.body);
  try {
    // Create a new report based on the data received in the request body
    const newReport = new Report({
      first: req.body.fname,
      last: req.body.lname,
      email: req.body.email,
      dateOfTrip: req.body.date,
      category: req.body.category,
      subCategory: req.body.subcategory,
      details: req.body.details,
      dateCreated: new Date()  // Assuming you want the current date and time
    });
    const savedReport = await newReport.save();
    res.json(true);
  } catch (err) {
    res.json(false);
  }
}

