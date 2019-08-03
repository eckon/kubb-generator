// uses team and player data

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

let teams = createTeams(users);
let games = createAllPossibleGames(teams);
let uniqueGames = sortAndFilterGames(games);
let orderedGames = orderGames(uniqueGames, users, teams, amountOfGames);

printGame(orderedGames, users, teams);
printUserMatrix(users);

function createAllPossibleGames(data) {
    let games = [];
    for (let team1 in data) {
        for (let team2 in data) {
            let game = [Number(team1), Number(team2)];
            game = game.sort();
            
            // the team should not play against itself
            if (game.filter((val, id, self) => self.indexOf(val) === id).length !== 2) {
                continue;
            }
            
            // players shouldnt play against themselfs
            if ([...data[Number(team1)], ...data[Number(team2)]].filter((val, id, self) => self.indexOf(val) === id).length !== 4) {
                continue;
            }

            games.push(game);
        }
    }

    return games;
}

function orderGames(data, userMapping, teamMapping, maximumGames = null) {
    let playerPlayCounter = Array(userMapping.length).fill(0);
    let teamPlayCounter = Array(teamMapping.length).fill(0);
    let result = [];
    let lastGame = parseInt(data.length * Math.random());
    let adder = 5;
    
    for (let {} in data) {
        if (maximumGames !== null && result.length >= maximumGames) {
            break;
        }

        // if we dont have anymore games -> break
        if (!lastGame) {
            break;
        }

        result.push(data[lastGame]);

        // use adder, so that the previous isnt as likely as others
        let currentTeam1 = teamMapping[data[lastGame][0]];
        let currentTeam2 = teamMapping[data[lastGame][1]];
        playerPlayCounter[currentTeam1[0]] += adder;
        playerPlayCounter[currentTeam1[1]] += adder;
        playerPlayCounter[currentTeam2[0]] += adder;
        playerPlayCounter[currentTeam2[1]] += adder;

        teamPlayCounter[data[lastGame][0]] += adder;
        teamPlayCounter[data[lastGame][1]] += adder;

        adder += 5;

        let combinedCounter =
            playerPlayCounter[currentTeam1[0]] + playerPlayCounter[currentTeam1[1]] + playerPlayCounter[currentTeam2[0]] + playerPlayCounter[currentTeam2[1]]
            + teamPlayCounter[data[lastGame][0]] + teamPlayCounter[data[lastGame][1]];
        
        lastGame = findLocalMinimum(data, combinedCounter, playerPlayCounter, teamPlayCounter, teamMapping, result);
    }
    
    return result;
}

function findLocalMinimum(data, counter, playerPlayCounter, teamPlayCounter, teamMapping, usedGames) {
    let min = Infinity;
    let results = [];

    for (let game of data) {

        // skip already used games
        if (usedGames.includes(game)) {
            continue;
        }

        let currentTeam1 = teamMapping[game[0]];
        let currentTeam2 = teamMapping[game[1]];
        let combinedCounter =
            playerPlayCounter[currentTeam1[0]] + playerPlayCounter[currentTeam1[1]] + playerPlayCounter[currentTeam2[0]] + playerPlayCounter[currentTeam2[1]]
            + teamPlayCounter[game[0]] + teamPlayCounter[game[1]];
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

function printGame(data, userMapping, teamMapping) {
    let gameCounter = 0;

    for (let game of data) {
        gameCounter++;
        document.querySelector('#game').innerHTML +=
            `<tr>
                <td>${gameCounter}.</td>
                <td>${userMapping[teamMapping[game[0]][0]]} & ${userMapping[teamMapping[game[0]][1]]}</td>
                <td>${userMapping[teamMapping[game[1]][0]]} & ${userMapping[teamMapping[game[1]][1]]}</td>
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

function createTeams(data) {
    let results = [];
    for (let user1 in data) {
        for (let user2 in data) {
            if (user1 === user2) {
                continue;
            }

            let team = [Number(user1), Number(user2)].sort();
            results.push(team);
        }
    }

    // sort, cast to a string to get only the uniques with the set and convert to array again
    let sorted = results.sort();
    let stringCasted = sorted.map(x => `${x[0]}.${x[1]}`)
    let unique = [...new Set(stringCasted)];
    let teams = unique.map(x => {
        const elements = x.split('.');
        return [Number(elements[0]), Number(elements[1])];
    })
    
    return teams;
}

function sortAndFilterGames(data) {
    let sortedTeams = data.map(x => [...x].sort((a, b) => Number(a) >= Number(b)));
    let stringCastedGames = sortedTeams.map(x => `${x[0]}.${x[1]}`);
    let uniqueGamesStringCasted = [...new Set(stringCastedGames)];
    let uniqueGames = uniqueGamesStringCasted.map(x => {
        const elements = x.split('.');
        return [Number(elements[0]), Number(elements[1])];
    });

    return uniqueGames;
}
