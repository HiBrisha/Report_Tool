/**
 * Controller for handling data-related operations.
 * @module controllers/dataController
 */
const { selectData, updateData } = require("./sqlController.js");

/******************************* GET DATA FROM DATABASE **********************
 * Get data from the database.
 * @function getDataFromDatabase
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 */
const getDataFromDatabase = async (req, res, mssql, dbConfig, queryCMD) => {
  try {
    // Execute SQL query to retrieve data from the database
    const data = await selectData(mssql, dbConfig, queryCMD);

    // Send the retrieved data back to the client as JSON
    res.json(data);
    return JSON.stringify(data);
  } catch (error) {
    // Handle errors if any
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    mssql.close();
  }
};
/******************************* END GET DATA FROM DATABASE ***********************/

/******************************* UPDATE DATA IN DATABASE **********************
 * Update data in the database.
 * @function updateDataToDataBase
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 * @param {object} mssql - MSSQL module for executing SQL queries.
 * @param {object} dbConfig - Configuration object for connecting to the database.
 */
const updateDataToDataBase = async (req, res, mssql, dbConfig) => {
  try {
    // Execute SQL query to retrieve data from the database
    const requestData = req.body.data;
    const data = await updateData(mssql, dbConfig, requestData);

    // Send the retrieved data back to the client as JSON
    res.status(200).send({
      success: true,
      message: "Data merged successfully",
      result: data,
    });
  } catch (error) {
    // Handle errors if any
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while merging data",
      error: error,
    });
  } finally {
    mssql.close();
  }
};
/******************************* END UPDATE DATA TO DATABASE **********************/

module.exports = { getDataFromDatabase, updateDataToDataBase };
