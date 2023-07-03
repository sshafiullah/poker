const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

const HandRank = {
  HighCard: 'High Card',
  OnePair: 'One Pair',
  TwoPairs: 'Two Pairs',
  ThreeOfAKind: 'Three of a Kind',
  Straight: 'Straight',
  Flush: 'Flush',
  FullHouse: 'Full House',
  FourOfAKind: 'Four of a Kind',
  StraightFlush: 'Straight Flush',
}

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

// Get the rank of a hand
function getRank(hand){
  card1 = Cards[hand[0]];
  card2 = Cards[hand[1]];
  card3 = Cards[hand[2]];
  card4 = Cards[hand[3]];
  card5 = Cards[hand[4]];

  cards = [card1,card2,card3,card4,card5];
  cards.sort(function(a, b){return a-b});
  if(isStraight(cards)){
    console.log("The hand is straight")
  }
  else {
    console.log("The hand is not straight")
  }
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



// Set EJS as the view engine
app.set('view engine', 'ejs');

// Parse JSON bodies
app.use(bodyParser.json());

// Route to handle JSON input
app.post('/json', (req, res) => {
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
    console.log(combined)

    if(checkDuplicates(combined)){
      throw new Error("There are duplicate cards being used in your deck\n")
    }

    getRank(jsonData.Hand1)

    // Render the JSON data in an HTML template and send it to the client
  res.render('jsonTemplate', { jsonData });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).send(error.message);
  }
  

  // Render the JSON data in an HTML template and send it to the client
  //  res.render('jsonTemplate', { jsonData: req.body });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

