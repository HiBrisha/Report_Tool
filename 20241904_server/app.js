/*********************************************START DEPENDENCES AND INITIALIZATIONS *****************
 * Required modules and initializations for the Node.js application.
 * This code imports necessary modules such as Express, CORS, HTTPS, File System, MSSQL, Socket.IO, and custom modules.
 * It also initializes the Express application, sets up CORS, creates an HTTPS server, and initializes Socket.IO.
 * @module dependenciesAndInitializations
 */
const express = require("express");
const cors = require("cors");
const https = require("https"); // Using HTTPS
const fs = require("fs");
const mssql = require("mssql");
const socketio = require("socket.io");
const { dbConfig, corsOptions } = require("./configs/config")
const { getDataFromDatabase,updateDataToDataBase } = require("./controllers/dataController")
const {getRestrictedCounts} = require("./router/taskRouter")
const {selectData} = require("./controllers/sqlController")
const { queryCMD } = require("./sql/query")
/***************************END DEPENDENCES AND INITIALIZATIONS *********************************

/***************************START SETUP MIDDLE WARE *********************************
 * Express application setup.
 * This code initializes the Express application, sets up middleware for JSON parsing,
 * defines the server port, enables CORS using the specified options, initializes Socket.IO,
 * and initializes an empty array to store asset sockets.
 * @module expressSetup
 */
const app = express();
app.use(express.json());
const port = 448;
app.use(cors(corsOptions));
const assetSockets = [];
/***************************END SETUP MIDDLE WARE *********************************/

/****************************START HTTPS SERVER INITIALIZATION *********************************
 * HTTPS server initialization.
 * This code creates an HTTPS server instance using the provided key and certificate files,
 * and associates it with the Express application.
 * @module httpsServerInitialization
 */
const server = https.createServer({
    key: fs.readFileSync("./doc/cert/private_key.pem"),
    cert: fs.readFileSync("./doc/cert/avuong_net.pem")
}, app);
const io = socketio(server, { corsOptions });
/****************************END HTTPS SERVER INITIALIZATION *********************************

/**********************************************START SOCKET MODULE************************************************
 * Serve index.html with assetID parameter.
 * This route serves the index.html file with the specified assetID parameter.
 * It emits the assetID to all connected sockets using socket.io.
 * @module serveIndex
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/index.html/:assetID", (req, res) => {
    const assetID = req.params.assetID;
    io.emit("assetID", assetID);
    res.sendFile(__dirname + "/public/index.html");
});


/*****************************************************************************************************************
 * Handle socket connections.
 * This code initializes socket connections and handles events such as client connection and disconnection.
 * It periodically fetches data from the database and emits it to the client.
 * @module socketHandler
 * @param {Object} server - The HTTP server object.
 * @param {Object} corsOptions - CORS options object.
 */
io.on("connection", (socket) => {
    console.log("Client connected");

    const assetID = socket.handshake.query.assetID;
    assetSockets[assetID] = socket;
    // Periodically fetch data from the database and emit to the client
    const intervalId = setInterval(async () => {
        if (Object.keys(assetSockets).length > 0) {
            try {
                //console.log(queryCMD('','SOCKET','') + `${assetID}';`);
                const data = JSON.stringify(await selectData(mssql, dbConfig, (queryCMD('','SOCKET','') + `${assetID}';`)));
                socket.emit("assetID", {
                    assetID: assetID,
                    message: JSON.stringify(data),
                });
            } catch (err) {
                console.error("Error:", err);
            }
        }
    }, 10000);

    // Handle disconnection
    socket.on("disconnect", () => {
        //console.log(`AssetID ${assetID} disconnected`);
        delete assetSockets[assetID];
        if (Object.keys(assetSockets).length === 0) {
            mssql.close();
            console.log("Disconnected from the database");
        }
    });
});
/******************************************END SOKET MODULE******************************************************* */

/******************************************START GET RESTRICTEDCOUNSTS ENDPOINT**************************************
 * API endpoint for retrieving restricted counts.
 * This endpoint retrieves restricted counts data from the database and sends it as a JSON response.
 * @module restrictedCountsEndpoint
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get('/api/restrictedCounts', cors(corsOptions), async (req, res) => {
    try {
      const result = await getRestrictedCounts(dbConfig, mssql);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
/******************************************END GET RESTRICTEDCOUNSTS ENDPOINT**************************************/

/******************************************START ACDC DATA ENDPOINT**************************************
 * API Endpoint for retrieving DCS Data ACDC.
 * This endpoint retrieves ACDC data from the database based on the provided datetime query parameter.
 * It uses asynchronous execution to fetch data and sends the result as a JSON response.
 * @module acdcDataEndpoint
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/api/v1/data/ACDC", cors(corsOptions), async (req, res) => {
    // Initialize async function
    getDataFromDatabase(req, res,mssql,dbConfig,(queryCMD(req.query.datetime,'ACDC','')))
  });
/******************************************END ACDC DATA ENDPOINT**************************************/

/******************************************START THANH DAN DONG DATA ENDPOINT**************************************
 * API Endpoint for retrieving DCS Data Thanh Dan Dong.
 * This endpoint retrieves Thanh Dan Dong data from the database based on the provided datetime query parameter.
 * It uses asynchronous execution to fetch data and sends the result as a JSON response.
 * @module ThanhDanDongDataEndpoint
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/api/v1/data/TDD", cors(corsOptions), async (req, res) => {
    // Initialize async function
    getDataFromDatabase(req, res,mssql,dbConfig,(queryCMD(req.query.datetime,'TDD','')))
  });
/******************************************END THANH DAN DONG DATA ENDPOINT**************************************/

/******************************************START TRAM 220kV DATA ENDPOINT**************************************
 * API Endpoint for retrieving DCS Data Tram220kV.
 * This endpoint retrieves Tram220kV data from the database based on the provided datetime query parameter.
 * It uses asynchronous execution to fetch data and sends the result as a JSON response.
 * @module Tram220kVDataEndpoint
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/api/v1/data/T220", cors(corsOptions), async (req, res) => {
    // Initialize async function
    getDataFromDatabase(req, res,mssql,dbConfig,(queryCMD(req.query.datetime,'T220','')))
  });
/******************************************END TRAM 220kV DATA ENDPOINT**************************************/

/******************************************START THONG SO VAN HANH H1 DATA ENDPOINT**************************************
 * API Endpoint for retrieving DCS Data Thong So Van Hanh H1.
 * This endpoint retrieves Thong So Van Hanh H1 data from the database based on the provided datetime query parameter.
 * It uses asynchronous execution to fetch data and sends the result as a JSON response.
 * @module Tram220kVDataEndpoint
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/api/v1/data/TSVH_H1", cors(corsOptions), async (req, res) => {
    // Initialize async function
    getDataFromDatabase(req, res,mssql,dbConfig,(queryCMD(req.query.datetime,'TSVH_H1','')))
  });
/******************************************END THONG SO VAN HANH H1 DATA ENDPOINT**************************************/

/******************************************START THONG SO VAN HANH H2 DATA ENDPOINT**************************************
 * API Endpoint for retrieving DCS Data Thong So Van Hanh H2.
 * This endpoint retrieves Thong So Van Hanh H2 data from the database based on the provided datetime query parameter.
 * It uses asynchronous execution to fetch data and sends the result as a JSON response.
 * @module Tram220kVDataEndpoint
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/api/v1/data/TSVH_H2", cors(corsOptions), async (req, res) => {
    // Initialize async function
    getDataFromDatabase(req, res,mssql,dbConfig,(queryCMD(req.query.datetime,'TSVH_H2','')))
  });
/******************************************END THONG SO VAN HANH H2 DATA ENDPOINT**************************************/

/*******************************************START UPDATING DATA ENDPOINT************************************************
 * API Endpoint for updating data.
 * This endpoint handles POST requests to update data in the database.
 * It expects a JSON body containing the data to be updated.
 * The endpoint processes the data using a MERGE query and sends a response indicating the success or failure of the operation.
 * @module updateDataEndpoint
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.post("/api/v1/data/update", cors(corsOptions), async (req, res) => {
    updateDataToDataBase(req,res,mssql,dbConfig)
  });
/******************************************END UPDATING DATA ENDPOINT**************************************/
 
// Start the HTTPS server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

