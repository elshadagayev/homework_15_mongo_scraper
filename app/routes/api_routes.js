const NYTimesScraper = require("../modules/ny-times-scraper")
const scraper = new NYTimesScraper();

module.exports = (app) => {
    app.post("/api/articles/scrape", (req, res) => {
        scraper.scrape((resp) => {
            res.json(resp);
        })
    })

    app.put('/api/articles/save/:id', (req, res) => {
        scraper.saveArticle(req.params.id, resp => {
            res.json(resp);
        });
    })

    app.get('/api/articles/unsaved', (req, res) => {
        scraper.getNewArticles((resp) => {
            res.json(resp);
        })
    })

    app.get('/api/articles/saved', (req, res) => {
        scraper.getSavedArticles((resp) => {
            res.json(resp);
        })
    })

    app.get('/api/articles/notes/:id', (req, res) => {
        scraper.getArticleNotes(req.params.id, resp => {
            res.json(resp);
        })
    })

    app.post('/api/articles/notes/:id', (req, res) => {
        scraper.saveArticleNote(req.params.id, req.body.note, resp => {
            res.json(resp);
        })
    })

    app.delete('/api/articles/notes/remove', (req, res) => {
        scraper.removeArticleNote(req.body.id, resp => {
            res.json(resp);
        })
    });

    app.put('/api/articles/:id/remove_from_saved', (req, res) => {
        scraper.removeArticleFromSaved(req.params.id, resp => {
            res.json(resp);
        })
    })
}