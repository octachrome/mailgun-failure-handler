const express = require('express');
const bodyParser = require('body-parser');
const {cloudFunction} = require('./index');

const app = express();
app.use(bodyParser.json());
app.listen(process.env.PORT || 3000);
app.post('/', cloudFunction);
