const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const middlewares = require("./middlewares");
const LogEntry = require("./models/LogEntry");
const bcrypt = require("bcrypt");
const session = require("express-session");
const port = 9999;

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

const session_secret = "newton";
app.use(
  session({
    secret: session_secret,
    resave: true, 
    saveUninitialized: true
  })
);
mongoose
  .connect("mongodb://localhost:27017/travel-log", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model("user", userSchema);

const isNullorUndefined = (val) => val === null || val === undefined;
const SALT = 8;

// signup code

app.post("/signup", async (req, res) => {
  const { userName, password } = req.body;
  if (userName.length === 0 || password.length === 0)
    res.status(401).send({ err: "Fill all credentials." });
  else {
    const existngUser = await userModel.findOne({ userName });
    if (isNullorUndefined(existngUser)) {
      const hashedPwd = bcrypt.hashSync(password, SALT);
      const newUser = new userModel({
        userName,
        password: hashedPwd,
      });
      await newUser.save();
      req.session.userName = newUser.userName;
      //console.log(req.session.userName);
      res.send({
        success: `Congratulations ${userName}! Your account has been created.`,
      });
    } else {
      res.status(404).send({ err: "Username already exists." });
    }
  }
});

// login code

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  if (userName.length === 0 || password.length === 0)
    res.status(401).send({ err: "Fill all credentials." });
  else {try{
    const existngUser = await userModel.findOne({ userName });
    if (isNullorUndefined(existngUser)) {
      res.status(401).send({ err: "Username does not exist!" });
    } else {
      const hashedPwd = existngUser.password;
      if (bcrypt.compareSync(password, hashedPwd)) {
        req.session.userName = existngUser.userName;
        console.log(req.session.userName);
        res.status(200).send({ success: "Logged in successfully" });
      } else {
        res.status(401).send({ err: "Incorrect Password!" });
      }
    }
  }catch(e){
    console.log(e);
  }
  }
});

app.get("/logout", async (req, res) => {
  if (!isNullorUndefined(req.session)) {
    req.session.destroy(() => res.status(200).send("destroyed"));
  } else {
    res.sendStatus(200);
  }
});

const AuthMiddleware = async (req, res, next) => {
  console.log(req.session.userName);
  console.log(req.session);
  if (isNullorUndefined(req.session) || isNullorUndefined(req.session.userName)) {
    res.status(401).send({ err: "Not logged in" });
  } else {
    next();
  }
};

app.get("/loggedin", AuthMiddleware, (req, res) => {
  res.send({ ok: "logged in" , userName:req.session.userName});
});

app.get("/logs", AuthMiddleware, async (req, res, next) => {
  try {
    const entries = await LogEntry.find({userName: req.session.userName});
    console.log(entries);
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

app.post("/logs", AuthMiddleware, async (req, res, next) => {
  try {
    const logEntry = new LogEntry(req.body);
    logEntry.userName = req.session.userName;
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});


app.patch("/logs/:id", AuthMiddleware, async (req, res, next) => {
  const id = req.params.id;
  try {
    const existing = await LogEntry.findOne({ _id: id });
    if (req.body.title) {
      existing.title = req.body.title;
      await LogEntry.updateOne(
        {
          _id: id,
        },
        {
          title: req.body.title,
        }
      );
    }
    existing.description = req.body.description;
    await LogEntry.updateOne({
      description: req.body.description,
    });
    existing.image = req.body.image;
    await LogEntry.updateOne({
      image: req.body.image,
    });
    if (req.body.visitDate) {
      existing.visitDate = req.body.visitDate;
      await LogEntry.updateOne({
        visitDate: req.body.visitDate,
      });
    }
    await existing.save();
    res.json(existing);
  } catch (error) {
    next(error);
  }
});

app.delete("/logs/:id", AuthMiddleware, async (req, res, next) => {
  const id = req.params.id;
  try {
    await LogEntry.deleteOne({ _id: id });
    res.send({
      message: "log deleted",
    });
  } catch (error) {
    next(error);
  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});