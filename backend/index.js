const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();

app.use(express.json());

// Use cors middleware with default options
app.use(cors());

const userRoute = require('./Routes/api');
app.use('/api', userRoute);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(9000, () => {
  console.log('Server is running on port 9000');
});
