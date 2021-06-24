const db = require('../models')
const moment = require ('moment');
const Post = db.Post
const User = db.User
const Tag = db.Tag
const Post_Tag = db.Post_Tag;
// Include date converter
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');

module.exports = {
    getHomePage:(req,res)=>{
        const asyncGetAllPosts = async()=>{
            let posts = await db.sequelize.query(`SELECT * FROM Posts, Accounts WHERE Posts.authorId = Accounts.id AND Posts.isPublic = true ORDER BY Posts.createdAt DESC;`, { type: QueryTypes.SELECT })
            return posts;
        }
        Promise.all([asyncGetAllPosts()]).then(values => {
            let posts = values[0];
            res.render('index', { posts,  noPost: posts.length === 0 });
          });
    }
}