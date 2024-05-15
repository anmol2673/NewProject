const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/rageopenai').then(() => {
    console.log("DB Connection Successful");
  }).catch((err) => {
    console.log("Error while connecting to DB");
  });
