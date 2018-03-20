module.exports = (app) => {
    app.get("/", (req, res) => {
        res.render("home")
    })

    app.get('/articles', (req, res) => {
        res.render('articles');
    })
}