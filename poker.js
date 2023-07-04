const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

const Cards = {
  S1: 14,
  S2: 2,
  S3: 3,
  S4: 4,
  S5: 5,
  S6: 6,
  S7: 7,
  S8: 8,
  S9: 9,
  S10: 10,
  S11: 11,
  S12: 12,
  S13: 13,
  C1: 14,
  C2: 2,
  C3: 3,
  C4: 4,
  C5: 5,
  C6: 6,
  C7: 7,
  C8: 8,
  C9: 9,
  C10: 10,
  C11: 11,
  C12: 12,
  C13: 13,
  H1: 14,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6,
  H7: 7,
  H8: 8,
  H9: 9,
  H10: 10,
  H11: 11,
  H12: 12,
  H13: 13,
  D1: 14,
  D2: 2,
  D3: 3,
  D4: 4,
  D5: 5,
  D6: 6,
  D7: 7,
  D8: 8,
  D9: 9,
  D10: 10,
  D11: 11,
  D12: 12,
  D13: 13,
}

const HandRank = {
  100: 'One Pair',
  200: 'Two Pairs',
  300: 'Three of a Kind',
  400: 'Straight',
  500: 'Flush',
  600: 'Full House',
  700: 'Four of a Kind',
  800: 'Straight Flush',
}

// Check if card names for hands are valid
function validateCard(card){
  if (Object.keys(Cards).includes(card)) {
    return true;
  }
  return false;
}

// Check if there are duplicate cards being used in either hand
function checkDuplicates(hands){
  const encounteredValues = {};
  let hasDuplicates = false;

  for (let i = 0; i < hands.length; i++) {
    const value = hands[i];

    if (encounteredValues[value]) {
      hasDuplicates = true;
      break;
    }

    encounteredValues[value] = true;
  }
  
  if (hasDuplicates){
    return true;
  }

  return false;
}

function sortHand(hand){
  card1 = Cards[hand[0]];
  card2 = Cards[hand[1]];
  card3 = Cards[hand[2]];
  card4 = Cards[hand[3]];
  card5 = Cards[hand[4]];

  cards = [card1,card2,card3,card4,card5];
  cards.sort(function(a, b){return a-b});
  return cards;
}

// Get the rank of a hand
function getRank(hand){

  cards = sortHand(hand);
	
  if(isStraight(cards) && isFlush(hand)){
    return '800';
  }
  else if (isFourOfAKind(cards)){
    return '700';
  }
  else if (isFullHouse(cards)){
    return '600';
  }
  else if (isFlush(hand)){
    return '500';
  }
  else if (isStraight(cards)){
    return '400';
  }
  else if (isThreeOfAKind(cards)){
    return '300';
  }
  else if (isTwoPairs(cards)){
    return '200';
  }
  else if (isAPair(cards)){
    return '100';
  }
  else {
    return highCard(cards);
  }
}

// Tie breaker function
function tiebreaker(hands){

  console.log("Hand1 and Hand2 had a tie. Lets run them through tie breaker")
  hand1 = hands.Hand1;
  hand2 = hands.Hand2;

  cards1 = sortHand(hand1);
  cards2 = sortHand(hand2);

  if(isStraight(cards1) || isFlush(hand1)){
    high1 = highCard(cards1);
    high2 = highCard(cards2);
    console.log("Hand1 has value: " + high1 + "\nHand2 has value: " + high2 + "\n")
    if(high1 > high2){
      return hand1;
    }
    else if(high2 > high1){
      return hand2;
    }
    else {
      return hands;
    }
  }
  else if(isFourOfAKind(cards1) || isFullHouse(cards1) || isThreeOfAKind(cards1) || isTwoPairs(cards1) || isAPair(cards1)){
    high1 = sumTopCombo(cards1);
    high2 = sumTopCombo(cards2);
    console.log("Hand1 has value: " + high1 + "\nHand2 has value: " + high2 + "\n")
    if(high1 > high2){
      return hand1;
    }
    else if(high2 > high1){
      return hand2;
    }
    else {
      return hands;
    }
  }
  else {
      return hands;
  }
}

// Returns the sum value of the top pair, triple or quad in a hand
function sumTopCombo(hand){
  const counts = {};
  const pair = {};
  sum = 0;

  for (let i = 0; i < hand.length; i++) {
    const value = hand[i];
    counts[value] = (counts[value] || 0) + 1;
  }

  for (const [key, value] of Object.entries(counts)) {
    if (value >= 2){
      const multipliedValue = parseInt(key) * value;
      pair[key] = multipliedValue;
    }
  }

  for (let value in pair){
    if(sum < pair[value]){
      sum = pair[value];
    }
  }
  return sum;
}

// Check if hand is a Straight. Expects the input array to be sorted in ascending order
function isStraight(hand){
  const lowestRank = hand[0];
  for (let i = 1; i < hand.length; i++) {
    if (hand[i] !== lowestRank + i) {
      return false;
    }
  }
  return true;
}

// Checks the first letter of the card to determine suite and compares against the rest of the hand
function isFlush(hand){
  const suite = Array.from(hand[0])[0]
  for (let i = 1; i < hand.length; i++) {
    if (Array.from(hand[i])[0] != suite){
      return false;
    }
  }
  return true;
}

// Check if is Four of a Kind
function isFourOfAKind(hand){
  const counts = {};
  
  for (let i = 0; i < hand.length; i++) {
    const value = hand[i];
    counts[value] = (counts[value] || 0) + 1;
  }

  for (let value in counts) {
    if (counts[value] === 4){
      return true;
    }
  }
  return false;
}

// Check if is Full House
function isFullHouse(hand){
  const counts = {};
  triple = false;
  pair = false;

  for (let i = 0; i < hand.length; i++) {
    const value = hand[i];
    counts[value] = (counts[value] || 0) + 1;
  }

  for (let value in counts) {
    if (counts[value] === 3){
      triple = true;
    }
    else if (counts[value] === 2){
      pair = true;
    }
  }
  if (triple && pair){
    return true;
  }
  return false;
}


// Check if is Three of a Kind
function isThreeOfAKind(hand){
  const counts = {};

  for (let i = 0; i < hand.length; i++) {
    const value = hand[i];
    counts[value] = (counts[value] || 0) + 1;
  }

  for (let value in counts) {
    if (counts[value] === 3){
      return true;
    }
  }
  return false;
}

// Check for Two Pairs
function isTwoPairs(hand){
  const counts = {};
  pairs = 0

  for (let i = 0; i < hand.length; i++) {
    const value = hand[i];
    counts[value] = (counts[value] || 0) + 1;
  }

  for (let value in counts) {
    if (counts[value] === 2){
      pairs += 1
    }
  }

  if (pairs === 2){
    return true;
  }
  return false;
}

// Check for a single pair
function isAPair(hand){
  const counts = {};

  for (let i = 0; i < hand.length; i++) {
    const value = hand[i];
    counts[value] = (counts[value] || 0) + 1;
  }

  for (let value in counts) {
    if (counts[value] === 2){
      return true;
    }
  }
  return false;
}

// If no other match, get the high card value
function highCard(hand){
  cardsum = 0
  for (let i = 0; i < hand.length; i++) {
    if (hand[i] > cardsum){
      cardsum = hand[i];
    }
  }
  return cardsum;
}


// Set EJS as the view engine
app.set('view engine', 'ejs');

// Parse JSON bodies
app.use(bodyParser.json());

// Redirect root path to poker page
app.get('/', (req, res) => {
  res.redirect('/poker');
});

// Instructions page
app.get('/poker', (req, res) => {
  const html = `
    <html>
      <head>
        <title>Poker Instructions</title>
      </head>
      <body>
        <h1>Instructions</h1>
        <p>Instructions on how to use this /poker app</p>
        <p>Post card values to the /poker path in json format. You will need to pass 2 Hands with 5 cards each. 
	<br/>Each of the card suites is represented by the letters: H = Hearts, S = Spades, C = Clubs, D = Diamonds
	<br/>Example: H1 represents Ace of Hearts and C13 represents King of Clubs
	<br/>To send the request via curl:<br/> 
	<br/>curl -X POST -H "Content-Type: application/json" -d '{"Hand1": [ "H2", "C3", "H4", "H5", "H6"],"Hand2": ["S9", "C4", "C7", "D2", "S3"]}' http://URL:8080/poker
	</p>
      </body>
    </html>
  `;

  res.send(html);
});

// Route to handle JSON input
app.post('/poker', (req, res) => {
  const jsonData = req.body;
  try {

    // Check if the JSON data is valid
    if (typeof jsonData !== 'object' || jsonData === null) {
      throw new Error('Invalid JSON data\n');
    }
    
    if (!jsonData.hasOwnProperty('Hand1') || !jsonData.hasOwnProperty('Hand2')) {
      throw new Error('Required key "Hand1" are missing in the JSON data\n');
    }
    if (!Array.isArray(jsonData.Hand1) || !Array.isArray(jsonData.Hand2)) {
      throw new Error('Hand1 and Hand2 keys need to be arrays in format: {"Hand1": [ "H1", "H2", "C5", "D12", "D10"],"Hand2": ["H3", "H4", "C7", "D6", "S3"]}\n');
    }
    const hand  = Object.keys(jsonData)
    if (hand.length != 2) {
      throw new Error('There needs to be exactly 2 hands named Hand1 and Hand2\n') 
    }

    const hand1 = Object.keys(jsonData.Hand1);
    const hand2 = Object.keys(jsonData.Hand2);
    if (hand1.length != 5 || hand2.length != 5) {
      throw new Error('There needs to be exactly 5 card key values per hand.\n Each card value can be from each of the 4 suites: H = Hearts, D = Diamonds, C = clubs, S = Spades and numbered from 1-13.\n eg: "H10" - represents 10 of Hearts\n') 
    }

    for (let i = 0; i < jsonData.Hand1.length; i++){
      if (!validateCard(jsonData.Hand1[i])){
        throw new Error("Some cards in Hand1 are not valid\n")
      }
    }
    for (let i = 0; i < jsonData.Hand2.length; i++){
      if (!validateCard(jsonData.Hand2[i])){
        throw new Error("Some cards in Hand2 are not valid\n")
      }
    }
    const combined = jsonData.Hand1.concat(jsonData.Hand2);

    if(checkDuplicates(combined)){
      throw new Error("There are duplicate cards being used in your deck\n")
    }

    rank1 = getRank(jsonData.Hand1);
    rank2 = getRank(jsonData.Hand2);

    if (Object.keys(HandRank).includes(rank1)){
      console.log("Hand 1 has rank: " + HandRank[rank1] + "\n")
    } else {
      console.log("Hand 1 has rank: High Card with value = " + rank1 + "\n")
    }

    if (Object.keys(HandRank).includes(rank2)){
      console.log("Hand 2 has rank: " + HandRank[rank2] + "\n")
    } else {
      console.log("Hand 2 has rank: High Card with value = " + rank2 + "\n")
    }

    if (rank1 > rank2){
      Hand = jsonData.Hand1
      res.json({ Hand });
    }
    else if (rank2 > rank1){
      Hand = jsonData.Hand2
      res.json({ Hand });
    }
    else {
      Hand = tiebreaker(jsonData)
      res.json({ Hand });
    }
    //res.render('jsonTemplate', { winner });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).send(error.message);
  }
  

});


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

