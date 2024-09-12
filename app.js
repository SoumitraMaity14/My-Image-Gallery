const express = require('express');
const { default: mongoose } = require('mongoose');
const Listing = require('./models/listing');
const app = express()
var methodOverride = require('method-override')
const ejsMate = require("ejs-mate")


const path = require("path");
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const MONGO_URL = "mongodb://127.0.0.1:27017/myimage";

main().then(() => {
    console.log("connected to DB")
})
    .catch((err) => console.log(err))
async function main() {
    await mongoose.connect(MONGO_URL)
}

app.get("/", (req, res) => {
    res.send("hello I am root")
})

app.get("/listing", async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", { alllisting })
})

app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
})
app.post("/listing", async (req, res) => {
    const newlisting = new Listing(req.body.listing)
    await newlisting.save()
    res.redirect("/listing")
})
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
})
app.put("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let newdata = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    console.log(newdata)
    res.redirect(`/listing/${id}`)
})

app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id)
    console.log(deleteListing)
    res.redirect("/listing")
})

app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})
app.listen(8080, () => {
    console.log("server is running on port 8080")
})