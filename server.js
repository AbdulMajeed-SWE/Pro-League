const {
  fetchLeagues,
  fetchTeams,
  fetchTeam,
  fetchStats,
  fetchPlayers,
} = require("./models/api");
const express = require("express");
const nunjucks = require("nunjucks");

const app = express();

app.use(express.static("public"));

nunjucks.configure("views", {
  // autoescape: true,
  express: app,
});

app.use(express.urlencoded({ extended: false }));

app.route("/").get((req, res) => {
  //   const articles = fetchLeagues(apiUrl)
  const articles = fetchLeagues()
    .then(function (data) {
      // Handle the response data here
      // res.send(data);
      res.render("home.html", { data });
      console.log(data);
    })
    .catch(function (error) {
      // Handle any errors here
      console.error(error);
    });
});

app.route("/leagues/:leagueID").get((req, res) => {
  const teams = fetchTeams(req.params.leagueID)
    .then(function (data) {
      // Handle the response data here
      // res.send(data);
      res.render("pro.html", { data });
      // console.log(data);
    })
    .catch(function (error) {
      // Handle any errors here
      console.error(error);
    });
});

app.route("/leagues/:leagueID/:teamID").get((req, res) => {
  const players = fetchPlayers(req.params.leagueID, req.params.teamID)
    .then(function (data) {
      // Handle the response data here
      // res.send(data);
      res.render("index.html", { data });
      // console.log(data);
    })
    .catch(function (error) {
      // Handle any errors here
      console.error(error);
    });
});

app.route("/leagues/:leagueID/:teamID/:playerID").get((req, res) => {
  const stats = fetchStats(req.params.playerID)
    .then(function (data) {
      // Handle the response data here
      // res.send(data);
      res.render("player.html", { data });
      // console.log(data);
    })
    .catch(function (error) {
      // Handle any errors here
      console.error(error);
    });
});

app.listen(3000, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port 3000");
});
