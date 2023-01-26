const express = require("express");
const app = express();

console.log("Backend runnin");

app.listen("5000", () => {
    console.log("Backend running.");
})