const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const htmlToImage = require('html-to-image')

// const cors = require('cors');


dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8000;
const connectDB = require("./server/database/connection");
connectDB();

const app = express();
// app.use(cors());



const Userdb = require("./server/model/model");
const Admindb = require("./server/model/admin");


app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use('/swaga', userRouter);

app.use((error, req, res, next) => {
  console.log("This is the rejected field ->", error.field);
});

app.set("view engine", "ejs");

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

//***admin route */

app.post("/", (req, res, next) => {
  const adminUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  };

  Admindb.create(adminUser, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json("User save successfully...");
    }
  });
});

//** admin login route */

app.get("/login", (req, res) => {
  Admindb.find({}, (err, items) => {
    const username = req.params.username;
    const password = req.params.password;

    if (req.body.username == username || req.body.password == password) {
      Userdb.find({}, (err, items) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: "An Error Occurred", errr });
        } else {
          res.redirect("all_user");
        }
      });
    } else {
      console.log(err);
      res.redirect("/");
    }
  });
});

//** admin login route */
//***admin route */

app.get("/all_user", (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    Userdb.findById(id).then((user) => {
      if (!user) {
        res
          .status(400)
          .send({ message: "User with the ID:" + id + "not found" });
      } else {
        res.send(user);
      }
    });
  }
  Userdb.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "An Error Occurred", errr });
    } else {
      res.render("admin", { items: items });
    }
  });
});

app.post("/adduser", upload.single("image"), (req, res, next) => {
  const User = {
    name: req.body.name,
    job: req.body.job,
    state: req.body.state,
    email: req.body.email,
    username: req.body.username,
    number: req.body.number,
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  Userdb.create(User, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render("document", { data: data });
    }
  });
});

app.post("/update-user/:id", (req, res) => {
  const id = req.params.id;
  Userdb.findById(id)
    .then((user) => {
      user.name = req.body.name;
      user.job = req.body.job;
      user.state = req.body.state;
      user.email = req.body.email;
      user.username = req.body.username;
      user.number = req.body.number;
      user
        .save()
        .then(() => {
          res.json("User Update...");
        })
        .catch((err) => res.status(400).json("Error:" + err));
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  Userdb.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. May be id is wrong` });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id + "with err:" + err,
      });
    });
});

app.get("/update-user", (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    Userdb.findById(id)
      .then((user) => {
        if (!user) {
          res.status(404).send({ message: "User not found" });
        } else {
          res.render("update_user", { user: user });
        }
      })
      .catch((err) => {
        res.send(500).send({ message: "Error retrieving User id" });
      });
  }
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/my_form", (req, res) => {
  res.render("add_user");
});

app.get("/all_user", (req, res) => {
  res.render("Admin");
});

let server = app.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Server running and listening at http:/%s:%s", host, port);
});
