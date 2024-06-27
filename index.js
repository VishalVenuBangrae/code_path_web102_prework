/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let game of games){


        // create a new div element, which will become the game card
        const gameCard = document.createElement('div');

        // add the class game-card to the list
        gameCard.classList.add('game-card');


        // set the inner HTML using a template literal to display some info 
        gameCard.innerHTML =    `<h3>${game.name}</h3>
                                <img class="game-img" src="${game.img}" alt="${game.name}" />
                                <p>${game.description}</p>
                                <p><strong>Backers: </strong>${game.backers}</p>`;
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gamesContainer.appendChild(gameCard);


        // append the game to the games-container
    }
}

addGamesToPage(GAMES_JSON);

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => {
    return total + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((total, game) => {
    return total + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.length;
gamesCard.innerHTML = `${totalGames.toLocaleString()}`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let unfundedGames = GAMES_JSON.filter((game)=>{
        return game.goal > game.pledged; 
    }    
    );
    console.log(unfundedGames.length);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);

}



// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let fundedGames = GAMES_JSON.filter((game)=>{
        return game.goal <= game.pledged; 
    }    
    );
    console.log(fundedGames.length);
    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn").addEventListener("click", filterUnfundedOnly);
const fundedBtn = document.getElementById("funded-btn").addEventListener("click", filterFundedOnly);
const allBtn = document.getElementById("all-btn").addEventListener("click", showAllGames);

// add event listeners with the correct functions to each button


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedGames = GAMES_JSON.filter((game)=>{
    return game.goal > game.pledged; 
}    
);
const count = unfundedGames.length;
// create a string that explains the number of unfunded games using the ternary operator
let unfundedGamesString = `A total of $${totalRaised.toLocaleString()} has been raised for ${totalGames} game${totalGames !== 1 ? 's' : ''}. Currently, ${count} game${count !== 1 ? 's remain' : ' remains'} unfunded. We need your help to fund these amazing games!`;
// create a new DOM element containing the template string and append it to the description container
let newString = document.createElement('p');
newString.innerHTML = unfundedGamesString;
descriptionContainer.append(newString);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let[mostFundedGame, secondMostFundedGame, ...rest] = sortedGames;
let topFundedheading = document.createElement('h3');
topFundedheading.innerHTML = mostFundedGame.name;
let secondFundedheading = document.createElement('h3');
secondFundedheading.innerHTML = secondMostFundedGame.name;
firstGameContainer.append(topFundedheading);
secondGameContainer.append(secondFundedheading);



// create a new element to hold the name of the top pledge game, then append it to the correct element

// do the same for the runner up item

const searchInput = document.querySelector('.search-bar');
const suggestionsContainer = document.getElementById('suggestions-container');


searchInput.addEventListener('input', function() {
    const input = searchInput.value.toLowerCase().trim();
    suggestionsContainer.innerHTML = '';

    if (input.length > 0) {
        const filteredGames = GAMES_JSON.filter(game => 
            game.name.toLowerCase().includes(input)
        );

        filteredGames.forEach(game => {
            const suggestionElement = document.createElement('div');
            suggestionElement.classList.add('suggestion');
            suggestionElement.textContent = game.name;
            suggestionElement.addEventListener('click', function() {
                searchInput.value = game.name;
                suggestionsContainer.innerHTML = '';
                highlightGameCard(game.name);
            });
            suggestionsContainer.append(suggestionElement);
        });

        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
});

function highlightGameCard(gameName) {
    const allGameCards = document.querySelectorAll('.game-card');
    allGameCards.forEach(card => {
        card.style.backgroundColor = '';
    });

    showAllGames();
    const gameCards = document.querySelectorAll('.game-card h3');
    gameCards.forEach(card => {
        if (card.textContent === gameName) {
            card.parentNode.style.backgroundColor = 'yellow';
            card.parentNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Close suggestions on click outside
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.style.display = 'none';
    }
});

document.querySelector('.games').addEventListener('click', showAllGames);