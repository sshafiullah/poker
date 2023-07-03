const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

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
    
    if (!jsonData.hasOwnProperty('Hands')) {
      throw new Error('Required key "Hands" are missing in the JSON data\n');
    }
    if (!Array.isArray(jsonData.Hands)) {
      throw new Error('Hands key needs to be an array of dictionaries in format: {Hands: [{ hand1: { card1: card name, card2: card name... }, hand2: { card1: card name, card2: card name... }}]}\n');
    }
    const hand1 = Object.keys(jsonData.Hands[0]);
    //const hand2 = Object.keys(jsonData.Hands[1]);
    console.log(hand1.length)
    if (hand1.length != 5) {
      throw new Error('There needs to be exactly 5 card key values per hand named card1, card2,... card5\n') 
    }


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

