const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This section will help you get a list of all the records.
recordRoutes.route("/reviews").get(async function (req, res) {
  // Get records
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("reviews")
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching reviews");
      } else {
        res.json(result);
      }
    });
});

// This section will help you create a new record.
recordRoutes.route("/reviews").post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    review_id: req.body.id,
    last_modified: new Date(),
    comment_title: req.body.title,
    comment: req.body.comment,
  };

  dbConnect
    .collection("reviews")
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting review!");
      } else {
        console.log(`Added a new review with id ${result.insertedId}`);
        res.status(204).send();
      }
    });
});

// This section will help you update a record by id.
recordRoutes.route("/listings/updateLike").post(function (req, res) {
  // Update likes
});

// This section will help you delete a record
recordRoutes.route("/reviews/delete").delete((req, res) => {
  const dbConnect = dbo.getDb();
  const reviewQuery = { review_id: req.body.id };

  dbConnect
    .collection("reviews")
    .deleteOne(reviewQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting review with id ${reviewQuery.review_id}!`);
      } else {
        console.log("1 document deleted");
        res.status(204).send();
      }
    });
});

module.exports = recordRoutes;
