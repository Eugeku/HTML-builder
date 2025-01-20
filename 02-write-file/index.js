const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, './output.txt');
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Please enter text. Type "exit" or press Ctrl+C to quit.');
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    exitProcess();
  } else {
    fileStream.write(`${input}\n`);
  }
});

process.on('SIGINT', () => {
  exitProcess();
});

function exitProcess() {
  fileStream.end();
  rl.close();
  console.log('Bye bye! Thanks for using the application!');
  process.exit();
}
