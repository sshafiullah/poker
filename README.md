# Simple Poker Web App

In order to run this, please use:

npm install express body-parser ejs
node poker.js

# Usage

Instructions on how to use this /poker app

Post card values to the /poker path in json format. You will need to pass 2 Hands with 5 cards each.
Each of the card suites is represented by the letters: H = Hearts, S = Spades, C = Clubs, D = Diamonds
Example: H1 represents Ace of Hearts and C13 represents King of Clubs
To send the request via curl:

curl -X POST -H "Content-Type: application/json" -d '{"Hand1": [ "H2", "C3", "H4", "H5", "H6"],"Hand2": ["S9", "C4", "C7", "D2", "S3"]}' http://URL:8080/poker

