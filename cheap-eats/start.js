const mongoose = require('mongoose');

// import env variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our db and handle any bad connections
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// import models
require('./models/Restaurant');
require('./models/Review');
require('./models/User');

const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});