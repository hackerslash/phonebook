const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(URI)
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch(() => {
    console.log("Error in MongoDB connection");
  });

const phoneNumValidator = {
  validator: (value) => {
    return /^\d{2,3}-\d+$/.test(value);
  },
  message: "Invalid Phone Number Format",
};
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: phoneNumValidator,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
