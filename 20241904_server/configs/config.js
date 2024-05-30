/**
 * Configuration file for the Node.js application.
 * Contains configurations such as database connection settings and CORS options.
 * @module config
 */

/**
 * Configuration object for the database connection.
 * @type {object}
 * @property {string} user - Username for connecting to the MSSQL database.
 * @property {string} password - Password for connecting to the MSSQL database.
 * @property {string} server - Server address of the MSSQL database.
 * @property {string} database - Name of the MSSQL database.
 * @property {object} options - Additional options for the database connection.
 * @property {boolean} options.encrypt - Indicates whether to use encryption for the connection.
 * @property {boolean} options.trustServerCertificate - Indicates whether to trust the server certificate.
 */
const dbConfig = {
  user: "sql_service_user",
  password: "Pass@work1",
  server: "192.168.54.163",
  database: "XHQDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

/**
 * Configuration object for CORS (Cross-Origin Resource Sharing).
 * @type {object}
 * @property {string} origin - Specifies which domains are allowed to access the resources.
 * @property {string[]} methods - Specifies the HTTP methods that are allowed for the request.
 * @property {boolean} credentials - Indicates whether to include cookies in CORS requests.
 * @property {number} optionsSuccessStatus - HTTP status code to use for successful OPTIONS requests.
 */
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = { dbConfig, corsOptions };
