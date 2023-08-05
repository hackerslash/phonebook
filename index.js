const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'))

// morgan configuration
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - :body"));

let persons = [
  { name: "Arto Hellas", number: "040-123456", id: 1 },
  { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
  { name: "Dan Abramov", number: "12-43-234345", id: 3 },
  { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
];

//Get data for all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//Get info data
app.get("/info", (request, response) => {
  const numPersons = persons.length;
  const dateTime = new Date();
  response.send(
    `<p>Phonebook has info for ${numPersons} people </p> <p>${dateTime}</p>`
  );
});

//Get individual persons data
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((person) => person.id == id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = `Person with id ${id} is not available`;
    response.status(404).end();
  }
});

//Delete a id
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((person) => person.id != id);

  response.statusMessage = `Sucessfully deleted id ${id} if found`;
  response.status(204).end();
});

//add a new entry
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name missing",
    });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1000),
  };

  if (persons.find((person) => person.name === newPerson.name)) {
    return response.status(400).json({ error: "name must be unique" });
  } else {
    persons = persons.concat(newPerson);

    response.json(newPerson);
  }
});

const PORT = 3001 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
