//Default coding
const express = require('express');
const path = require('path');
//Default functions
const fs = require('fs');

//The port environment we're using
const PORT = process.env.PORT || 3001;



//Used last time in the session
const app = express();




//
//const apiRoutes = require('./routes/apiRoutes');
//const htmlRoutes = require('./routes/htmlRoutes');


const allInfo = require('./db/db.json');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Any info inside the public is going to be a static file.  As soon as requested, get it immediately.  No route needed
app.use(express.static('public'));

//Construction of the information in array
app.get('/api/notes', (req, res) => {
    res.json(allInfo.slice(1));
});

//Use the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//Retrieve notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//The function when retrieving the information
function createNewNote(body, notesArray) {
    const newinformation = body;
    //We know that the body is the writing of the function
    console.log(`What is body being identified? ` + body);
    //notesArray is the information being stored in db.json
    console.log(`What is the notes arrayed being idenftied? ` + notesArray);
    //This if statement is NEVER reached
    if (!Array.isArray(notesArray))
    {
        notesArray = [];
    }

    //We can now safely assume that when we push '0' in the array, it'll have that
    if (notesArray.length === 0)
    {
        //Save this just in case, cause this is working without pushing
        //notesArray.push(0);
        notesArray[0] = 0;
    }

    body.id = notesArray[0];
    notesArray[0]++;

    console.log(`BEFORE pushing this information, we have an array.  What is the value for the 1st array?
    ========================================
    ` + notesArray[1]);
    //The infrmation below is going to push on what has been added earlier on body.id.  It also increased the number on notesArray[0] by one, counting up
    notesArray.push(newinformation);
    //After this, the notesArray will be increased by 1 overall.  Ex:  notesArray[1] will now have a value if it was empty
    console.log(`Now that we know that the array is being pushed, what is the 2nd array?  If it's empty, will it read nothing?  If it's deleted, will it read nothing?  I want to make sure at least [1] is not being read: 
    ========================= 
    ` + notesArray[1]);
    //We also determined that the first array that has the number is also the notesArray[0] that was pushed earlier
    console.log(`What is the array of the function that is the first (meaning it's a 0?)
    ============================= 
    ` + notesArray[0]);

    //Write all this information in db.json
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    //Return the value as the new body
    return newinformation;
}

//POST information
app.post('/api/notes', (req, res) => {
    //Log that a POST request was received
    console.info(`${req.method} request received to add a review`);
    const newInfo = createNewNote(req.body, allInfo);
    res.json(newInfo);
});



//Delete Function
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            //Part 2 of the if and else statement goes:  If this list is empty, make the first array equal to 0.  This is so the number resets to avoid it from getting a much higher value that's unncessary.  We want it to reset.
            if(!notesArray[1])
            {
                notesArray[0] = 0;
            }
            break;
        }
    }
}

//The process in the delete information
app.delete('/api/notes/:id', (req, res) => {
    //Go to this function
    deleteNote(req.params.id, allInfo);
    //What's the ID number?
    console.log(`ID number for this is: ` + req.params.id);
    res.json(true);
});
//End of delete function


//Listening in for the port to activate
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});