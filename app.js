const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const newDate = new Date();
const year = newDate.getFullYear();
const month = newDate.getMonth() + 1;
const date = newDate.getDate();
const WEEKDAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const day = WEEKDAY[newDate.getDay()];
const currentDay = year + "/" + month + "/" + date + "/" + day;

const app = express();
// ejs 사용시 기본 작성
app.set("view engine", "ejs");
// body parser 사용시 기본 작성
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/todoPracticeDB");

const itemSchema = {
  todo: String,
};

const Item = mongoose.model("item", itemSchema);

const defaultItem1 = new Item({
  todo: "write what you have to do in the box below",
});
const defaultItem2 = new Item({
  todo: "if you click the check box, you can remove the to do list",
});
const defaultItems = [defaultItem1, defaultItem2];

app.get("/", (req, res) => {
  Item.find({}, (err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("default insert successful");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { currentDay: currentDay, itemLists: items });
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const newItem = new Item({
    todo: itemName,
  });
  newItem.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const itemId = req.body.checkbox;
  Item.deleteOne({ _id: itemId }, (err) => {
    if (err) {
      console.log(err);
    } 
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("server is on port 3000");
});
