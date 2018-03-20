const cheerio = require("cheerio")
const request = require("request")
const JSONResp = require("./json-resp")
const md5 = require("md5")
const { ArticleModel, NoteModel } = require("../models/articles")

class NYTimesScraper extends JSONResp {
    constructor () {
        super()
        this.url = "https://www.nytimes.com/section/world"
    }

    scrape (callback) {
        request.get({
            url: this.url,
            json: false
        }, (err, res, body) => {
            if(err)
               return callback(this.getErrorResponse(500, "Some error"))

            const $ = cheerio.load(body)
            let stories = $('ol.story-menu article.story');
            //let count = 0, limit = process.env.NY_TIMES_NEW_ARTICLES_LIMIT;
            this.saveArticles(stories, $);
            callback(this.getSuccessResponse({
                count: stories.length
            }));
        })
    }

    getNewArticles (callback) {
        ArticleModel.find({saved: false}, (err, doc) => {
            if(err)
                callback(this.getErrorResponse(500, "Unknown error"))
            else
                callback(this.getSuccessResponse(doc))
        });
    }

    getSavedArticles (callback) {
        ArticleModel.find({saved: true}, (err, doc) => {
            if(err)
                callback(this.getErrorResponse(500, "Unknown error"))
            else
                callback(this.getSuccessResponse(doc))
        });
    }

    saveArticles (stories, $) {
        for(let i = 0; i < stories.length; i++) {
            let el = stories[i];
            let news = {}
            news.link = $(el).find('a.story-link').attr('href')
            if(news.link === undefined)
                continue
            let date = $(el).find('time.dateline').attr('datetime').split('-')
        
            news.title = $(el).find('h2.headline').text().trim()
            news.content = $(el).find('p.summary').text().trim()
            news.date = new Date(date[0], date[1]-1, date[2], 0, 0, 0, 0).getTime()
            let Article = new ArticleModel();
            Article.title = news.title;
            Article.content = news.content;
            Article.date = news.date;
            Article.link = news.link;
            Article.save().then(() => {

            }).catch(() => {
                
            });
        }
    }

    saveArticle (id, callback) {
        ArticleModel.findByIdAndUpdate(id, {
            saved: true
        }, (err, res) => {
            if(err)
                callback(this.getErrorResponse(500, err));
            else
                callback(this.getSuccessResponse(res));
        })
    }

    saveArticleNote (article, note, callback) {
        new NoteModel({
            note,
            article
        }).save((err, doc) => {
            callback(this.getSuccessResponse(doc));
        });
    }

    getArticleNotes (id, callback) {
        NoteModel.find({
            article: id
        }, (err, docs) => {
            if(err)
                return callback(this.getErrorResponse(500, err))
            
            callback(this.getSuccessResponse(docs))
        });
    }

    removeArticleNote (id, callback) {
        NoteModel.findByIdAndRemove(id, (err, docs) => {
            if(err)
                return callback(this.getErrorResponse(500, err))
            
            callback(this.getSuccessResponse(docs))
        });
    }

    removeArticleFromSaved (id, callback) {
        ArticleModel.findByIdAndUpdate(id, {
            saved: false
        }, (err, docs) => {
            if(err)
                return callback(this.getErrorResponse(500, err))
            
            callback(this.getSuccessResponse(docs))
        })
    }
}

module.exports = NYTimesScraper;