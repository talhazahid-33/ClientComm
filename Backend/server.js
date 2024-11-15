const express = require("express");
const cors = require("cors");
const path = require('path');
const http = require("http");

const routes = require("./routes");
const app = express();
const server = http.createServer(app);

app.use(cors());
const bodyParser = require("body-parser");

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); 
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/", routes);
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

require('./socket')(server);

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
