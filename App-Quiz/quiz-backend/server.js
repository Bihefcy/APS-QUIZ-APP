require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const bodyParser = require('body-parser');
const questionRoutes = require('./routes/questions');
console.log('starting server...')

const app = express();
const port = process.env.PORT || 3000;  

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}))

// Debug middleware - add this to see incoming requests
app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
})

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
})

// Routes
console.log('Registering routes...');
app.use('/questions', questionRoutes);
console.log('Routes registered')


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true, // Deprecated in Mongoose 6
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

  

app.listen(port, () => console.log(`Server running on port ${port}`));  
