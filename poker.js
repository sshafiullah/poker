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
  S1: 'Ace of Spades',
  S2: 'Two fo Spades',
  S3: 'Three of Spades',
  S4: 'Four of Spades',
  S5: 'Five of Spades',
  S6: 'Six of Spades',
  S7: 'Seven of Spades',
  S8: 'Eight of Spades',
  S9: 'Nine of Spades',
  S10: 'Ten of Spades',
  S11: 'Jack of Spades',
  S12: 'Queen of Spades',
  S13: 'King of Spades',
  C1: 'Ace of Clubs',
  C2: 'Two fo Clubs',
  C3: 'Three of Clubs',
  C4: 'Four of Clubs',
  C5: 'Five of Clubs',
  C6: 'Six of Clubs',
  C7: 'Seven of Clubs',
  C8: 'Eight of Clubs',
  C9: 'Nine of Clubs',
  C10: 'Ten of Clubs',
  C11: 'Jack of Clubs',
  C12: 'Queen of Clubs',
  C13: 'King of Clubs',
  H1: 'Ace of Hearts',
  H2: 'Two fo Hearts',
  H3: 'Three of Hearts',
  H4: 'Four of Hearts',
  H5: 'Five of Hearts',
  H6: 'Six of Hearts',
  H7: 'Seven of Hearts',
  H8: 'Eight of Hearts',
  H9: 'Nine of Hearts',
  H10: 'Ten of Hearts',
  H11: 'Jack of Hearts',
  H12: 'Queen of Hearts',
  H13: 'King of Hearts',
  D1: 'Ace of Diamonds',
  D2: 'Two fo Diamonds',
  D3: 'Three of Diamonds',
  D4: 'Four of Diamonds',
  D5: 'Five of Diamonds',
  D6: 'Six of Diamonds',
  D7: 'Seven of Diamonds',
  D8: 'Eight of Diamonds',
  D9: 'Nine of Diamonds',
  D10: 'Ten of Diamonds',
  D11: 'Jack of Diamonds',
  D12: 'Queen of Diamonds',
  D13: 'King of Diamonds',
}

function validateCard(card){
  if (Object.keys(Cards).includes(card)) {
    return true
  }
  return false
}

function checkDuplicates(hands){
  console.log("I am within the function") 
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
      throw new Error('Hands key needs to be an array of dictionaries in format: {Hands: [{ hand1: { card1: card name, card2: card name... }, hand2: { card1: card name, card2: card name... }}]}\n');
    }
    const hand  = Object.keys(jsonData)
    if (hand.length != 2) {
      throw new Error('There needs to be exactly 2 hands\n') 
    }

    const hand1 = Object.keys(jsonData.Hand1);
    const hand2 = Object.keys(jsonData.Hand2);
    if (hand1.length != 5 || hand2.length != 5) {
      throw new Error('There needs to be exactly 5 card key values per hand named card1, card2,... card5\n') 
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

