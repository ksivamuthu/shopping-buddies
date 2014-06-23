var express = require('express');
var app = express();
app.use("/", express.static("C:/Ionic Projects/fbLogin/www"));
app.listen(8100); 