const express = require('express')
const app = express()
const port = 3000

app.use(funcion x(req, res, next) {
// Define a simple route
app.get('*', (req, res) => {
    res.sendFile(__dirname+'/mb/index.html');
  })
}


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});