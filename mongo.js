const mongoose = require("mongoose");


if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const URI = `mongodb+srv://afridijnv19:${password}@cluster0.owbmojc.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);

mongoose.connect(URI);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv[3] && process.argv[4]) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(result);
    mongoose.connection.close();
  });
}

Person.find({}).then((result) => {
  result.forEach((element) => console.log(element));
  mongoose.connection.close();
});
