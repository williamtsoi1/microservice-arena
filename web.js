const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Let the battle begin!');
});

// request structure
// {
//     "_links": {
//       "self": {
//         "href": "https://YOUR_SERVICE_URL"
//       }
//     },
//     "arena": {
//       "dims": [4,3], // width, height
//       "state": {
//         "https://A_PLAYERS_URL": {
//           "x": 0, // zero-based x position, where 0 = left
//           "y": 0, // zero-based y position, where 0 = top
//           "direction": "N", // N = North, W = West, S = South, E = East
//           "wasHit": false,
//           "score": 0
//         }
//         ... // also you and the other players
//       }
//     }
//   }

app.post('/', function (req, res) {
  console.log(req.body);
  const moves = ['F', 'T', 'L', 'R'];
  res.send(moves[Math.floor(Math.random() * moves.length)]);
});

app.listen(process.env.PORT || 8080);
