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
            let posts = await db.sequelize.query(`SELECT Posts.id, Posts.authorId, Posts.title, Posts.content, Posts.shopType, Posts.address, Posts.image, Posts.isPublic, DATE_FORMAT(Posts.createdAt, '%Y-%m-%d %H:%i') AS createdAt, Accounts.username 
                                                    FROM Posts, Accounts 
                                                    WHERE Posts.authorId = Accounts.id 
                                                    AND Posts.isPublic = true 
                                                    ORDER BY Posts.createdAt DESC;`, { type: QueryTypes.SELECT })
            return posts;
        }
        const asyncGetTags = async()=>{
            let tags = await db.sequelize.query(`SELECT postId, tagId, tagName FROM Post_Tags, Posts, Tags 
                                                    Where Posts.isPublic = true 
                                                    AND Posts.id = Post_Tags.postId 
                                                    AND Tags.id = Post_Tags.tagId;`, { type: QueryTypes.SELECT })
            return tags;
        }
        Promise.all([asyncGetAllPosts(),asyncGetTags()]).then(values => {
            let posts = values[0];
            let tags = values[1];
            var tagDict = {};
            tags.forEach(function(v){
                if(tagDict[v.postId]!== undefined){
                    tagDict[v.postId].push(v.tagName);
                }else{
                    tagDict[v.postId] = [];
                    tagDict[v.postId].push(v.tagName);
                }
            })
            posts.forEach(function(post){
                if(tagDict[post.id]!=undefined){
                  post['tags'] = tagDict[post.id];
              }
            })
            res.render('index',{posts:posts,noPost: posts.length === 0});
        });
    }
}