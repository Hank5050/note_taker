const fb = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { writeToFile, readAndAppend, readFromFile} = require('../helpers/fsUtils');
const fs = require('fs');
const { start } = require('repl');

// GET Route for retrieving all the feedback
fb.get('/notes', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
  
);

fb.post('/notes', (req, res) => {
  // Destructuring assignment for the items in req.body
  console.log(req.body);
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting Note');
  };
  
  
  
});

fb.delete('/notes/:id', (req, res) => {
	const notes = JSON.parse(fs.readFileSync('./db/db.json'));

	const note = notes.find((note) => note.id === req.params.id);
	if (!note)
		return res
			.status(404)
			.send(`Sorry! There is no course with the id ${req.params.id}`);

	const index = notes.indexOf(note);
	notes.splice(index, 1);
	writeToFile('./db/db.json', notes);

	const response = {
		status: 'success',
	};

	res.json(response);

});
  
module.exports = fb;