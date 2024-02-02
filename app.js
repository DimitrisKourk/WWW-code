const express = require("express");
const port = process.env.port || 4000;
const app = express();
const fs = require("fs");
const mysql = require("mysql");
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/images"));

app.use("/css", express.static("css"));
app.use("/js", express.static("js"));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("");
app.listen(port, function () {
  console.log("Server is running at ", port);
});

let aFileName = __dirname + "/api/music.json";

function getSongs(req, res) {
  fs.readFile(aFileName, function (err, data) {
    let songs = [];
    if (!err) songs = JSON.parse(data);
    res.status(200).json(songs);
  });
}

function getSong(req, res) {
  const id = parseInt(req.params.id);
  fs.readFile(aFileName, function (err, data) {
    let songs = [];
    if (!err) songs = JSON.parse(data);
    res.status(200).json(songs.filter((s) => s.id === id));
  });
}

function addSong(req, res) {
  const { id, album, name, releaseYear } = req.body;
  const newSong = { id: parseInt(id), album, name, releaseYear };
  fs.readFile(aFileName, function (err, data) {
    let songs = [];
    if (!err) songs = JSON.parse(data);
    songs.push(newSong);
    fs.writeFile(aFileName, JSON.stringify(songs), function (err) {
      if (err) {
        res.status(200).json(`Error adding id: ${id}`);
      } else {
        res.status(200).json(`Person added with id: ${id}`);
      }
    });
  });
}

function updateSong(req, res) {
  const { id, album, name, releaseYear } = req.body;
  const aSong = { id: parseInt(id), album, name, releaseYear };
  fs.readFile(aFileName, function (err, data) {
    let songs = [];
    if (!err) songs = JSON.parse(data);
    const anIndex = songs.findIndex((s) => s.id === aSong.id);
    if (anIndex < 0) {
      res.status(200).json(`Cannot find ID: ${id}`);
      return;
    }
    songs[anIndex] = aSong;
    fs.writeFile(aFileName, JSON.stringify(songs), function (err) {
      if (err) {
        res.status(200).json(`Error updating id: ${id}`);
      } else {
        res.status(200).json(`Updated id: ${id}`);
      }
    });
  });
}

function deleteSong(req, res) {
  const id = parseInt(req.body.id);
  fs.readFile(aFileName, function (err, data) {
    let songs = [];
    if (!err) songs = JSON.parse(data);
    const anIndex = songs.findIndex((s) => s.id === id);
    if (anIndex < 0) {
      res.status(200).json(`Cannot find ID: ${id}`);
      return;
    }
    songs.splice(anIndex, 1);
    fs.writeFile(aFileName, JSON.stringify(songs), function (err) {
      if (err) {
        res.status(200).json(`Error deleting id: ${id}`);
      } else {
        res.status(200).json(`Deleted id: ${id}`);
      }
    });
  });
}

app.get("/api/music", (req, res) => getSongs(req, res));
app.get("/api/music/:id", (req, res) => getSong(req, res));
app.post("/api/music", (req, res) => addSong(req, res));
app.put("/api/music/:id", (req, res) => updateSong(req, res));
app.delete("/api/music/:id", (req, res) => deleteSong(req, res));

const connection = mysql.createConnection({
  user: "sql11680320",
  host: "sql11.freesqldatabase.com",
  database: "sql11680320",
  password: "u3pzqNXXEZ",
  port: 3306,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

const showResults = (response, error, results) => {
  if (error) {
    console.log(error);
    results.status(200).json([]);
  }
  response.status(200).json(results);
};
async function getLinks(req, res) {
  const text = `SELECT * FROM Links ORDER BY id`;
  connection.query(text, (error, results) => {
    showResults(res, error, results);
  });
}
async function getLinksType(req, res) {
  const type = req.params.type;
  console.log(type);
  const values = [type];
  const text = `SELECT * FROM Links WHERE Type = ? ORDER BY id`;
  return connection.query(text, values, (error, results) => {
    showResults(res, error, results);
  });
}

async function addLink(req, res) {
  const { id, name, url, type } = req.body;
  const values = [id, name, url, type];
  const text = `
      INSERT INTO Links (id, Name, URL, Type)
      VALUES (?, ?, ?, ?)`;
  return connection.query(text, values, (error, results) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(`Link added with ID: ${id}`);
  });
}

async function updateLink(req, res) {
  const { id, name, url, type } = req.body;
  const values = [name, url, type, id];
  const text = `UPDATE Links 
				  SET Name=?, URL=?, Type=? 
				  WHERE id = ?`;
  return connection.query(text, values, (error, results) => {
    if (error) {
      res.status(200).json(error.message);
      return;
    }
    res.status(200).json(`Link with ID: ${id} updated`);
  });
}

async function deleteLink(req, res) {
  const id = parseInt(req.body.id);
  const values = [id];
  const text = `DELETE FROM Links WHERE id = ?`;
  return connection.query(text, values, (error, results) => {
    if (error) {
      res.status(200).json(error);
      return;
    }
    res.status(200).json(`Link with ID: ${id} deleted`);
  });
}

app.get("/api/links", (req, res) => getLinks(req, res));
app.get("/api/links/:type", (req, res) => getLinksType(req, res));
app.post("/api/links", (req, res) => addLink(req, res));
app.put("/api/links/:id", (req, res) => updateLink(req, res));
app.delete("/api/links/:id", (req, res) => deleteLink(req, res));
