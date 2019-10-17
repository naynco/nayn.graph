require('dotenv').config();
const app = require("express")();
const http = require("http").Server(app);
import OrientDB from 'orientjs';

const client = OrientDB({
  host: process.env.ORIENTDB_HOST,
  port: process.env.ORIENTDB_PORT,
  username: process.env.ORIENTDB_USERNAME,
  password: process.env.ORIENTDB_PASSWORD
});

const port = process.env.SERVER_PORT || 3000;

const boostrap = pool => {
  app.use((req, res, next) => {
    pool
      .acquire()
      .then(session => {
        res.locals.db = session;
        res.on("finish", () => {
          session.close();
        });
        next();
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

  app.get("/", function(req, res) {
    res.sendFile(__dirname + "views/index.html");
  });

  app.get("/graph", function(req, res) {
    res.locals.db
      .query("select from Actors limit 20")
      .all()
      .then(actors => {
        res.send(actors);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

  http.listen(port, function() {
    console.log("listening on *:" + port);
  });
};

client
  .connect()
  .then(() => {
    return client.sessions({
      name: "graph",
      pool: {
        max: 25
      }
    });
  })
  .then(pool => {
    boostrap(pool);
  })
  .catch(err => {
    console.log(err);
  });