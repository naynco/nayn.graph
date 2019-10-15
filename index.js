require('dotenv').config();
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const OrientDB = require('orientjs');

const client = OrientDB({
  host: process.env.ORIENTDB_HOST,
  port: process.env.ORIENTDB_PORT,
  username: process.env.ORIENTDB_USERNAME,
  password: process.env.ORIENTDB_PASSWORD
});

const db = client.use({
  name: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});