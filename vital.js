const ping = require("ping");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let isIntervalRunning = false;
const outputFile = path.join(__dirname, "ping_results.csv");

// Initialize the CSV file with headers
if (!fs.existsSync(outputFile)) {
  fs.writeFileSync(outputFile, "Date,Time,Target,Status\n");
}

// Function to pad numbers with leading zero if less than 10
const padZero = (value) => (value < 10 ? `0${value}` : value);

const writeToCsv = (date, time, target, status) => {
  const row = `${date} ${time},${target},${status}`;
  console.log("🚀 ~ writeToCsv ~ row:", row);
  fs.appendFileSync(outputFile, row + "\n", "utf8");
};

const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = padZero(now.getMonth() + 1); // Months are 0-indexed
  const day = padZero(now.getDate());
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}:${seconds}`,
  };
};

const checkPing = (target) => {
  ping.sys.probe(target, (isAlive) => {
    if (!isIntervalRunning) {
      isIntervalRunning = true;
      setInterval(() => {
        const { date, time } = getFormattedDateTime();
        writeToCsv(date, time, target, isAlive ? "Success" : "Failed");
      }, 10 * 1000);
    }
  });
};

// Ask for the IP address
rl.question("Enter the IP address to ping: ", (target) => {
  console.log(`Checking ping for ${target}...`);
  checkPing(target);
  rl.close(); // Close the input stream after receiving the target
});
