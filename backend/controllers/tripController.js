const db = require("../config/db");

const createTrip = (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      trip_name,
      destination,
      start_date,
      end_date,
      budget,
    } = req.body;

    const query = `
      INSERT INTO trips
      (user_id, trip_name, destination, start_date, end_date, budget)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        user_id,
        trip_name,
        destination,
        start_date,
        end_date,
        budget,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.status(201).json({
          message: "Trip Created Successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

const getTrips = (req, res) => {
  try {
    const user_id = req.user.id;

    const query = "SELECT * FROM trips WHERE user_id = ?";

    db.query(query, [user_id], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(result);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const addExpense = (req, res) => {

  try {

    const {
      trip_id,
      category,
      amount,
      expense_date,
    } = req.body;

    // get trip dates
    const tripQuery =
      "SELECT start_date, end_date FROM trips WHERE id = ?";

    db.query(
      tripQuery,
      [trip_id],
      (err, tripResult) => {

        if (err) {
          return res.status(500).json(err);
        }

        if (tripResult.length === 0) {

          return res.status(404).json({
            message: "Trip Not Found",
          });

        }

        const trip = tripResult[0];

        const expenseDate =
          new Date(expense_date);

        const startDate =
          new Date(trip.start_date);

        const endDate =
          new Date(trip.end_date);

        // validation
        if (
          expenseDate < startDate ||
          expenseDate > endDate
        ) {

          return res.status(400).json({
            message:
              "Expense date must be within trip dates",
          });

        }

        // add expense
        const insertQuery = `
          INSERT INTO expenses
          (trip_id, category, amount, expense_date)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [
            trip_id,
            category,
            amount,
            expense_date,
          ],
          (err, result) => {

            if (err) {

              return res.status(500).json(err);

            }

            res.status(201).json({
              message:
                "Expense Added Successfully",
            });

          }
        );

      }
    );

  } catch (error) {

    res.status(500).json(error);

  }

};

const getTotalExpenses = (req, res) => {

  try {

    const user_id = req.user.id;

    const query = `
      SELECT
      IFNULL(SUM(expenses.amount), 0) AS totalExpenses
      FROM expenses
      JOIN trips
      ON expenses.trip_id = trips.id
      WHERE trips.user_id = ?
    `;

    db.query(query, [user_id], (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(result[0]);

    });

  } catch (error) {

    res.status(500).json(error);

  }

};

const getTripAnalytics = (req, res) => {
  try {
    const { tripId } = req.params;

    const query = `
      SELECT 
      trips.trip_name,
      trips.budget,

      IFNULL(SUM(expenses.amount), 0) AS total_spent,

      (trips.budget - IFNULL(SUM(expenses.amount), 0))
      AS remaining_budget

      FROM trips

      LEFT JOIN expenses
      ON trips.id = expenses.trip_id

      WHERE trips.id = ?

      GROUP BY trips.id
    `;

    db.query(query, [tripId], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(result[0]);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteTrip = (req, res) => {

  try {

    const { id } = req.params;

    // delete expenses first
    const deleteExpensesQuery =
      "DELETE FROM expenses WHERE trip_id = ?";

    db.query(deleteExpensesQuery, [id], (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      // delete trip
      const deleteTripQuery =
        "DELETE FROM trips WHERE id = ?";

      db.query(deleteTripQuery, [id], (err) => {

        if (err) {
          return res.status(500).json(err);
        }

        res.status(200).json({
          message: "Trip Deleted Successfully",
        });

      });

    });

  } catch (error) {

    res.status(500).json(error);

  }
};
const updateTrip = (req, res) => {

  try {

    const { id } = req.params;

    const {
      trip_name,
      destination,
      budget,
    } = req.body;

    const query = `
      UPDATE trips
      SET
      trip_name = ?,
      destination = ?,
      budget = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [
        trip_name,
        destination,
        budget,
        id,
      ],
      (err, result) => {

        if (err) {

          console.log(err);

          return res.status(500).json(err);
        }

        res.status(200).json({
          message: "Trip Updated Successfully",
        });

      }
    );

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }
};
const getTripExpenses = (req, res) => {

  try {

    const { id } = req.params;

    const query =
      "SELECT * FROM expenses WHERE trip_id = ?";

    db.query(query, [id], (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(result);

    });

  } catch (error) {

    res.status(500).json(error);

  }
};
module.exports = {
  createTrip,
  getTrips,
  addExpense,
  getTripAnalytics,
  deleteTrip,
  updateTrip,
  getTripExpenses,
  getTotalExpenses,
};