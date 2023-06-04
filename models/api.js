// Import the Axios library
const axios = require("axios");

const API_KEY = "f5391287e6msh8e471cd211d60d6p1d29c7jsnb69640694f3b";

// Define a function that makes a GET request to an API endpoint
function fetchLeagues() {
  // Define the Axios request configuration object
  const config = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/leagues",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  // Make the Axios request and return a Promise
  return axios(config)
    .then(function (response) {
      // Return the response data
      return response.data;
    })
    .catch(function (error) {
      // Throw an error with the error message
      throw new Error(error.message);
    });
}

// Function to get all teams in a specific league and their statistics
async function fetchTeams(leagueID) {
  const league = leagueID;
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/teams",
    params: {
      league: league,
      season: "2020",
    },
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const teams = [];
    for (x in response.data.response) {
      // console.log(x);
      const teamStats = await fetchTeam(
        league,
        response.data.response[x].team.id
      ).then(function (teamStats) {
        const fullTeam = {
          leagueID: response.data.parameters.league,
          id: response.data.response[x].team.id,
          logo: response.data.response[x].team.logo,
          name: response.data.response[x].team.name,
          played: teamStats.response.fixtures.played.total,
          wins: teamStats.response.fixtures.wins.total,
          draws: teamStats.response.fixtures.draws.total,
          lose: teamStats.response.fixtures.loses.total,
          gd: teamStats.response.goals.for.total.total,
          points:
            teamStats.response.fixtures.wins.total * 3 +
            teamStats.response.fixtures.draws.total,
        };
        // console.log(fullTeam);
        teams.push(fullTeam);
        // console.log(teams);
      });
    }
    // console.log(response.data);
    teams.sort((a, b) => b.points - a.points);

    return teams;
  } catch (error) {
    console.error(error);
  }
}

async function fetchTeam(leagueID, teamID) {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/teams/statistics",
    params: {
      league: leagueID,
      season: "2020",
      team: teamID,
    },
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchPlayers(leagueID, teamID) {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/players",
    params: {
      team: teamID,
      league: leagueID,
      season: "2020",
    },
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const players = [];
    for (x in response.data.response) {
      // console.log(x);
      const teamStats = await fetchTeam(leagueID, teamID).then(function (
        teamStats
      ) {
        const fullPlayer = {
          leagueID: leagueID,
          teamID: teamID,
          teamLogo: teamStats.response.team.logo,
          teamName: teamStats.response.team.name,
          logo: response.data.response[x].player.photo,
          id: response.data.response[x].player.id,
          name: response.data.response[x].player.name,
        };
        players.push(fullPlayer);
      });
    }

    return players;
  } catch (error) {
    console.error(error);
  }
}

async function fetchStats(playerID) {
  const player = playerID;
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/players",
    params: {
      id: player,
      season: "2020",
    },
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Example usage:

module.exports = {
  fetchLeagues,
  fetchTeams,
  fetchTeam,
  fetchStats,
  fetchPlayers,
};
