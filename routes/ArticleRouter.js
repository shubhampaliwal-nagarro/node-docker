const express = require("express")
const ArticleModel = require('../models/article')
const router = express.Router();

router.post("/articles", async (request, response) => {
    const article = new ArticleModel(request.body);

    try {
        const articles = await ArticleModel.find({});
        const duplicate = articles.filter((t) => t.title === article.title)
        if(duplicate.length === 0){
            await article.save();
            response.send(article);
        }else {
            response.send({ data : "Record already exist"})
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get("/articles", async (request, response) => {
    try {
        const articles = await ArticleModel.find({});
        response.send(articles);
    } catch (error) {
        response.status(500).send({ error });
    }
});

module.exports = router
