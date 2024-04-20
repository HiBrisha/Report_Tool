const { queryCMD } = require("../sql/query.js");

/* Function: selectData
*
* Description:
* This function connects to the database using the provided configuration, executes a SQL query
* to retrieve data based on the provided query, and returns the result as an array of records.
* If an error occurs during the process, it logs the error and propagates it.
*
* Parameters:
* @param {object} mssql - MSSQL module for executing SQL queries.
* @param {object} dbConfig - Configuration object for connecting to the database.
* @param {string} query - SQL query to retrieve data from the database.
*
* Returns:
* Returns an array of records retrieved from the database.
* 
* @throws {Error} Throws an error if there's an issue executing the query.
*/
async function selectData(mssql, dbConfig, query) {
  try {
    await mssql.connect(dbConfig);
    //Excute query
    const request = new mssql.Request();
    let result = await request.query(query);

    return result.recordset;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err; // Propagate the error
  }
}

/**
 * Function: updateData
 *
 * Description:
 * This function connects to the database using the provided configuration, executes SQL queries
 * to update data based on the provided dataUpdate, and returns the result.
 *
 * Parameters:
 * @param {object} mssql - MSSQL module for executing SQL queries.
 * @param {object} dbConfig - Configuration object for connecting to the database.
 * @param {array} dataUpdate - Array of data objects containing information for updating the database.
 *
 * Returns:
 * Returns the result of the update operation.
 */
async function updateData(mssql, dbConfig, dataUpdate) {
  const pool = await mssql.connect(dbConfig);
  //console.log(requestData)
  const mergeQuery = dataUpdate
    .map((data) => queryCMD("", "MERGE_DATA", data))
    .join("");

  const result = await pool.request().query(mergeQuery);
  return result;
}

module.exports = { selectData, updateData };
