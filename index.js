const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;
const MONGODB_URL =
      "mongodb+srv://yadhu:yadhu575@ecommerce.md6jvim.mongodb.net/yadhuecommerce?retryWrites=true&w=majority&appName=ecommerce";


// mongodb connection
// console.log(process.env.MONGODB_URL)
// mongoose.set('strictQuery', false)
// mongoose.connect(process.env.MONGODB_URL)
// .then(()=>console.log("Connect to Database"))

async function connect() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connect to Database");
  } catch (error) {
    console.log(`Error -> ${error}`);
  }
}

connect();

// schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmpassword: String,
  image: String,
});

// model
const userModel = mongoose.model("user", userSchema);

//api
app.get("", (req, res) => {
  res.send("Server is running");
});

//signup

app.post("/signup", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel
    .findOne({ email: email })
    .then((result) => {
      if (result) {
        res.send({ message: "Email id is already registered", alert: false });
      } else {
        const data = new userModel(req.body);
        return data.save();
      }
    })
    .then(() => {
      res.send({ message: "Successfully signed up", alert: true });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Error occurred", alert: false });
    });
});


//api login
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }).then((result) => {
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({ message: "Login is successfully", alert: true,data : dataSend  });
    }
    else{
      res.send({ message: "Email is not available, please sign up", alert: false,});
    }
  });
});





//product section

const schemaProduct = mongoose.Schema({
  name : String,
  category : String,
  image :String,
  price : String,
  description : String,
});
const productModel = mongoose.model("product",schemaProduct)


//save product in database
//api
app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body)
  const data =await productModel(req,body)
  const datasave = await data.save()
  res.send({message : "upload successfully"})
})

//server running

app.listen(PORT, () => console.log("server is running at port : " + PORT));
