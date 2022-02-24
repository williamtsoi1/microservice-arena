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
  // console.log(req.body);
  const self_url = req.body._links.self.href;
  const arena_width = req.body.arena.dims[0];
  const arena_height = req.body.arena.dims[1];
  const self_state = req.body.arena.state[self_url];
  var response_body = "";
  
  // check if there is someone 3 squares ahead of me
  console.log("At " + self_state.x + "," + self_state.y)
  var enemy_found = false;
  var enemy_same_axis = false;
  switch (self_state.direction) {
    case "N":
        // check if there are enemies with same x value, but smaller y value
        console.log("Facing N")
        for (var enemy_url in req.body.arena.state) {
            if (enemy_url != self_url) {
                var enemy_state = req.body.arena.state[enemy_url];
                if ((enemy_state.x == self_state.x) && (enemy_state.y < self_state.y) && ((self_state.y - enemy_state.y) < 3)) {
                  console.log("Found near enemy: " + enemy_url + " " + enemy_state.x + "," + enemy_state.y + " in direction N");
                  enemy_found = true;
                } else if ((enemy_state.x == self_state.x) && (enemy_state.y < self_state.y)) {
                  console.log("Found enemy on same axis: " + enemy_url + " " + enemy_state.x + "," + enemy_state.y + " in direction N");
                  enemy_same_axis = true;
                }
            }

        }
        break;
    case "W":
        // check if there are enemies with smaller x value, but same y value
        console.log("Facing W")
        for (var enemy_url in req.body.arena.state) {
            if (enemy_url != self_url) {                  
                var enemy_state = req.body.arena.state[enemy_url];
                if ((enemy_state.x < self_state.x) && (enemy_state.y == self_state.y) && ((self_state.x - enemy_state.x) < 3)) {
                  console.log("Found enemy: " + enemy_url + " " + enemy_state.x + "," + enemy_state.y + " in direction W");
                  enemy_found = true;
                } else if ((enemy_state.x < self_state.x) && (enemy_state.y == self_state.y)) {
                    console.log("Found enemy on same axis: " + enemy_url + " " + enemy_state.x + "," + enemy_state.y + " in direction W");
                    enemy_same_axis = true;
                }
            }
        }
        break;
    case "E":
        // check if there are enemies with larger x value, but same y value
        console.log("Facing E")
        for (var enemy_url in req.body.arena.state) {
            if (enemy_url != self_url) {
                var enemy_state = req.body.arena.state[enemy_url];
                if ((enemy_state.x > self_state.x) && (enemy_state.y == self_state.y) && ((enemy_state.x - self_state.x) < 3)) {
                  console.log("Found enemy: " + enemy_url + " " + enemy_state.x + "," + enemy_state.y + " in direction E");
                  enemy_found = true;
                } else if ((enemy_state.x > self_state.x) && (enemy_state.y == self_state.y)) {
                    console.log("Found enemy on same axis: " + enemy_url + " " + enemy_state.x + "," + enemy_state.y + " in direction E");
                    enemy_same_axis = true;
                }
            }
        }
        break;
    case "S":
        // check if there are enemies with same x value, but larger y value
        console.log("Facing S")
        for (var enemy_url in req.body.arena.state) {
            if (enemy_url != self_url) {
                var enemy_state = req.body.arena.state[enemy_url];
                if ((enemy_state.x == self_state.x) && (enemy_state.y - self_state.y) && ((enemy_state.y - self_state.y) < 3)) {
                  console.log("Found enemy: " + enemy_url + " " + enemy_state.x + "," + enemy_state.y + " in direction S");
                  enemy_found = true;
                } else if ((enemy_state.x == self_state.x) && (enemy_state.y - self_state.y)) {
                    console.log("Found enemy on same axis: " + enemy_url + " " + enemy_state.x + "," + enemy_state.y + " in direction S");
                    enemy_same_axis = true;
                }
            }
        }
        break;
  }
  if (enemy_found) {
      console.log("Throwing");
      response_body = "T";
  }
  else if (enemy_same_axis) {
      console.log("Moving Forward");
      response_body = "F";
  } else {
      console.log("No enemy found, turning in random direction");
      const moves = ['L', 'R'];
      response_body = moves[Math.floor(Math.random() * moves.length)];
  }
  res.send(response_body);
});

app.listen(process.env.PORT || 8080);
