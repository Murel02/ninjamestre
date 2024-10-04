const express = require('express');
const fs = require('fs-extra');
const EventEmitter = require('events');
const app = express();
const port = 3000;

eventEmitter = new EventEmitter();

app.use(express.json());

eventEmitter.on('log', (message) =>{
    console.log('log: ' + message);
});

app.use((req, res, next) => {
   eventEmitter.emit('log', `request received: ${req.method} ${req.url}`);
   next();
});

app.get('/read-file', async(req, res) => {
    try{
        const data = await fs.readFile('data.txt', 'utf8');
        res.send(data);
    }catch(err){
        console.error(err);
        res.status(500).send('Error reading file');
    }
});

app.post('write-file', async (req, res) => {
    try{
        const content = req.body.content;
        console.log(content);
        if(!content){
            return res.status(400).send('No content provided');
        }
        await fs.writeFile('data.txt', content);
        res.send('File written successfully');
    }catch(err){
        console.error(err);
        res.status(500).send('Error writing file');
    }
});

app.listen(port, () => {
    eventEmitter.emit('log', `Started on port ${port}`);
    console.log(`Server running on http://localhost:${port}`);
});

