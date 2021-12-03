var express = require('express');
var app = express();

var templates = [
    {
        title: "To-Do List",
        text: "Sunday\n\nMonday\n\nTuesday\n\nWednesday\n\nThursday\n\nFriday\n\nSaturday"
    },
    {
        title: "Lecture Notes",
        text: "Name: \nSection: \nDate: \nTopic: \n\nMain Ideas\n\nQuestions"
    },
    {
        title: "Lorem ipsum",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];

app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("Client Request");
    let data = JSON.parse(req.query['data']);

    if(data['action'] == 'request_note') {
        var jsonText = JSON.stringify({
        'action': 'response',
        'templates': templates,
        'msg': 'server response'
        })
        res.send(jsonText);
    }
    
}).listen(3000);

console.log("server is running");
