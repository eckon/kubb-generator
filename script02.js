// uses only player data

const amountOfGames = 50;
let users = [
    'Birgit S.',
    'Dieter',
    'Anja',
    'Ralf',
    'Heike',
    'Josef',
    'Roti',
    'Rainer',
    'Ludger',
    'Birgit',
];

users = users.sort();

let games = createAllPossibleGames(users);

// normally we would sort and then delete all non unique arrays
// but this is not working for some reason (overwrites all the arrays to [0,1,2,3]...)
// games = games.map(x => [...x].sort());

// because the filter of these games is not working -> we build more than we want and delete the duplicates later (in deleteSameGame)
games = orderGames(games, amountOfGames * 2);
games = deleteSameGame(games);

printGame(games, users, amountOfGames);
printUserMatrix(users);

function createAllPossibleGames(data) {
    let games = [];
    for (let player1 in data) {
        for (let player2 in data) {
            for (let player3 in data) {
                for (let player4 in data) {
                    let game = [Number(player1), Number(player2), Number(player3), Number(player4)];

                    // check if the array does not contain any duplicates
                    if (game.filter((val, id, self) => self.indexOf(val) === id).length === 4) {
                        games.push(game);
                    }
                }
            }
        }   
    }

    return games;
}

function orderGames(data, maximumGames = null) {
    let playCounter = Array(users.length).fill(0);
    let result = [];
    let lastGame = parseInt(data.length * Math.random());
    let adder = 5;
    
    for (let {} of data) {
        if (maximumGames !== null && result.length >= maximumGames) {
            break;
        }

        // if we dont have anymore games -> break
        if (!lastGame) {
            break;
        }

        result.push(data[lastGame]);

        // use adder, so that the previous isnt as likely as others
        playCounter[data[lastGame][0]] = playCounter[data[lastGame][0]] + adder;
        adder = adder + 5;
        playCounter[data[lastGame][1]] = playCounter[data[lastGame][1]] + adder;
        adder = adder + 5;
        playCounter[data[lastGame][2]] = playCounter[data[lastGame][2]] + adder;
        adder = adder + 5;
        playCounter[data[lastGame][3]] = playCounter[data[lastGame][3]] + adder;
        adder = adder + 50;

        let combinedCounter =
            playCounter[data[lastGame][0]] + playCounter[data[lastGame][1]] + playCounter[data[lastGame][2]] + playCounter[data[lastGame][3]];
        
        lastGame = findLocalMinimum(data, combinedCounter, playCounter);
    }

    return result;
}

function findLocalMinimum(data, counter, playCounter) {
    let min = Infinity;
    let results = [];

    for (let game of data) {
        let combinedCounter = playCounter[game[0]] + playCounter[game[1]] + playCounter[game[2]] + playCounter[game[3]];
        if (combinedCounter > counter) {
            continue;
        }
        if (combinedCounter < min) {
            results = [];
            min = combinedCounter;
            results.push(data.indexOf(game));
        }
        if (combinedCounter === min) {
            results.push(data.indexOf(game));
        }
    }

    let randomIndex = parseInt(results.length * Math.random());
    return results[randomIndex];
}

function printGame(data, mapping, amount = null) {
    let gameCounter = 0;

    for (let game of data) {
        if (amount !== null && gameCounter >= amount) {
            break;
        }
        gameCounter++;
        // let output = `${gameCounter}. Spiel: %c${mapping[game[0]]} und %c${mapping[game[1]]} gegen %c${mapping[game[2]]} und %c${mapping[game[3]]}`;
        // console.log(output, 'background:#'+game[0]+game[0]+game[0], 'background:#'+game[1]+game[1]+game[1], 'background:#'+game[2]+game[2]+game[2], 'background:#'+game[3]+game[3]+game[3]);

        document.querySelector('#game').innerHTML +=
            `<tr>
                <td>${gameCounter}.</td>
                <td>${mapping[game[0]]} & ${mapping[game[1]]}</td>
                <td>${mapping[game[2]]} & ${mapping[game[3]]}</td>
                <td></td>
            </tr>`;
    }
}

function printUserMatrix(data) {
    for (let user of data) {
        document.querySelector('#user-matrix').innerHTML +=
            `<tr>
                <td>${user}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>`;
    }
}

function randomizeSamePairing(data) {
    for (let game of data) {
        let id = data.indexOf(game);
    }
}

function deleteSameGame(data) {
    let result = [];
    let lastId = 0;
    dataCheck = data.map(x => [...x].sort());
    console.log(data)
    console.log(dataCheck)
    
    for (let game of dataCheck) {
        let id = dataCheck.indexOf(game);
        if (lastId <= id) {
            result.push(data[id]);
            lastId = id;
        }
    }

    return result;
}
