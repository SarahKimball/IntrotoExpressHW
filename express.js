const express = require('express');

const app = express();
app.use(express.json());

// Middleware to check if the input is a valid number
function isValidNumber(req, res, next) {
  const nums = req.query.nums;
  const numbers = nums.split(',');
  for (let i = 0; i < numbers.length; i++) {
    if (isNaN(numbers[i])) {
      res.status(400).json({ error: `${numbers[i]} is not a number` });
      return;
    }
  }
  next();
}

// Middleware to check if the nums query parameter is provided
function hasNums(req, res, next) {
  if (!req.query.nums) {
    res.status(400).json({ error: 'nums are required' });
    return;
  }
  next();
}

// Statistical operations
function mean(numbers) {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
}

function median(numbers) {
  const sortedNumbers = numbers.sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedNumbers.length / 2);
  if (sortedNumbers.length % 2 === 0) {
    return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
  } else {
    return sortedNumbers[middleIndex];
  }
}

function mode(numbers) {
  const frequency = {};
  let maxFrequency = 0;
  let mode = [];

  numbers.forEach((number) => {
    frequency[number] = frequency[number] || 0;
    frequency[number]++;
    if (frequency[number] > maxFrequency) {
      maxFrequency = frequency[number];
      mode = [number];
    } else if (frequency[number] === maxFrequency) {
      mode.push(number);
    }
  });

  return mode;
}

// Route for calculating the mean
app.get('/mean', hasNums, isValidNumber, (req, res) => {
  const nums = req.query.nums.split(',').map(Number);
  const value = mean(nums);
  res.json({ operation: 'mean', value });
});

// Route for calculating the median
app.get('/median', hasNums, isValidNumber, (req, res) => {
  const nums = req.query.nums.split(',').map(Number);
  const value = median(nums);
  res.json({ operation: 'median', value });
});

// Route for calculating the mode
app.get('/mode', hasNums, isValidNumber, (req, res) => {
  const nums = req.query.nums.split(',').map(Number);
  const value = mode(nums);
  res.json({ operation: 'mode', value });
});

// Route for performing all three operations at once
app.get('/all', hasNums, isValidNumber, (req, res) => {
  const nums = req.query.nums.split(',').map(Number);
  const meanValue = mean(nums);
  const medianValue = median(nums);
  const modeValue = mode(nums);
  res.json({ operation: 'all', mean: meanValue, median: medianValue, mode: modeValue });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
