
require("dotenv").config()
const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const { apiRoutes, htmlRoutes } = require("./app/routes")
const PORT = process.env.PORT || 5000

app = express()

app.engine('handlebars', exphbs({defaultLayout: 'index'}))
app.set('view engine', 'handlebars')
app.enable('view cache')
app.use(express.static("views/static"))
app.use(bodyParser.urlencoded({
    extended: true
}));

apiRoutes(app)
htmlRoutes(app)


app.listen(PORT, () => {
    console.log("App started and listening port", PORT)
})

