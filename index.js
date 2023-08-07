require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// morgan configuration
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms - :body"));

//Get data for all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

//Get info data
app.get("/info", (request, response) => {
  const dateTime = new Date();
  Person.count({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people </p> <p>${dateTime}</p>`
      );
    })
    .catch(() => {
      response.status(500).send("Error fetching data");
    });
});

//Get individual persons data
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findById(id).then((result) => {
    if (result) {
      response.json(result);
    } else {
      response.statusMessage = "Invalid ID";
      response.status(404).end();
    }
  });
});

//Delete a id
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  console.log(id);

  Person.findByIdAndRemove(id)
    .then((result) => {
      response.statusMessage = `Successfullt Deleted ${id}`;
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });

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

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((result) => {
    response.json(result);
  });
});

//handle update of an entry

app.put("/api/persons/:id", (req, res, next) => {
  const newPerson = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

const PORT = 3001 || process.env.PORT;

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
