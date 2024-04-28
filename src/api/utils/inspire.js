const quotesData = {

}

const randomIndex = Math.floor(Math.random() * quotesData.length);
const selectedQuote = quotesData[randomIndex];

console.log(selectedQuote.quote);
console.log('-', selectedQuote.author);
