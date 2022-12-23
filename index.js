const express = require('express');
const app = express();
const PORT = 5000;
const db = require('./database')

app.use(express.json());

require('./models/user');
require('./models/record');
db.model("User");
db.model("Record");
app.use(require('./routes/auth'));
app.use(require('./routes/record'));

app.listen(PORT, () => {
  console.log(`The Server is running on port: ${PORT}`);
})