//Load the required libs
const express = require('express');
const handlebars = require('express-handlebars');

//Tunables
const PORT = parseInt(process.argv[2] || process.env.APP_PORT || 3000);

//Create an instance of express
const app = express();

//configure handlebars
app.engine('hbs', handlebars({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


app.get('/dice', (req, resp) => {

    let i = 0;
    
    while(i ==0)
    {
        i = getRandomInt(6);
    }

    resp.status(200);
    resp.format({
        'text/html': () => {
            resp.render('singledice', { diceNum: i});
        },        
        'text/csv': () => {
            resp.send(`Number,${i}`);
        },
        'application/json': () => {
            resp.json({
                Number: `/dice/d${i}.png`
            });
        },
        'default': () => {
            resp.status(406);
            resp.type('text/plain');
            resp.send('Not acceptable');
        }
    })
})

app.get('/dices/:num', (req, resp) => {

    var numOfDice = -1;
    try{
       numOfDice = parseInt(req.params.num);
    }
    catch{
        resp.status(404);
        resp.type('text/html');
        resp.sendFile(__dirname + '/content/404.html');
    }
    if(numOfDice > 0)
    {
        var listOfNumbers = new Array(numOfDice);

        let x=0;
        for(x=0 ; x< listOfNumbers.length; x++)
        {
            let i = 0;
        
            while(i ==0)
            {
                i = getRandomInt(6);
            }
            listOfNumbers[x] = i;
        }
        
        resp.status(200);
        resp.format({
            'text/html': () => {
                resp.render('dices', { diceNum: listOfNumbers});
            },        
            'text/csv': () => {
                var reply="";
                for(x=0 ; x< listOfNumbers.length; x++)
                {
                    reply += `Number${x + 1},${listOfNumbers[x]}\n`;
                }
                resp.send(reply);
            },
            'application/json': () => {
                var reply="{";
                for(x=0 ; x< listOfNumbers.length; x++)
                {
                    if(x!=0)
                        reply += ",\n";
                    reply += `"Number${x + 1}":"/dice/d${listOfNumbers[x]}.png"`;
                }

                reply+="}";

                var obj = JSON.parse(reply);
                resp.json({obj
                });
            },
            'default': () => {
                resp.status(406);
                resp.type('text/plain');
                resp.send('Not acceptable');
            }
        })
    }
})


//load static resources from content
app.get(/.*/, express.static(__dirname +'/content'));


//Error
app.use((req, resp) =>{
    resp.status(404);
    resp.type('text/html');
    resp.sendFile(__dirname + '/content/404.html');
    
    })

//start the server
app.listen(PORT, () => {
    console.info(`Application started at ${new Date()} on port ${PORT}`);
});



function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }