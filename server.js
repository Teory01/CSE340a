/* ******************************************
 * server.js - Primary application file
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")
const messages = require("express-messages")
const env = require("dotenv").config()
const pool = require("./database/") // PostgreSQL connection

// Routes & Controllers
const staticRoute = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const wishlistRoute = require("./routes/wishlistRoute")
const utilities = require("./utilities/")

/* ***********************
 * App Initialization
 *************************/
const app = express()

/* ***********************
 * Middleware
 *************************/

// Parse JSON and URL-encoded form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from "public"
app.use(express.static("public"))

// Sessions (with Postgres store)
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

// Cookies
app.use(cookieParser())

// Flash messages
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = messages(req, res)
  next()
})

// JWT Token check
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine Setup
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(staticRoute)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/wishlist", wishlistRoute)

/* ***********************
 * 404 - File Not Found
 *************************/
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})
