const express = require('express')
const app = express()
const port = 3000

var names = ["Hayden Tuttle","Jonah Fullen","Name","Name","Name"]; //add your names to this array

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<HTML><BODY bgcolor=#c0c0c0>');
    res.write('<H1>Welcome to trove!</H1>')
    res.write('<H2>created by : </H2>');
    for(let i =0;i<names.length;i++) {
        res.write("<H3>" + names[i] + "</H3>");
    }
    res.end('</BODY></HTML>');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
