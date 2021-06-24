const { body, validationResult } = require('express-validator')
const db = require('../models');
const path = require('path');
const fs = require('fs');
const User = db.Account;
const Post = db.Post;
const ShopType = db.Shop_Type;
const Tag = db.Tag
const Post_Tag = db.Post_Tag;
const { QueryTypes } = require('sequelize');
module.exports = {
    getAllPost: (req, res) => {
        res.redirect('/')
    },
    getNewPostPage:(req,res)=>{
        const asyncGetShopTypes = async()=>{
            let shopTypes = await db.sequelize.query("SELECT * FROM `Shop_Types`", { type: QueryTypes.SELECT });
            return shopTypes;
        }
        Promise.all([asyncGetShopTypes()]).then(values => {
            var shopTypes = values[0];
            res.render('add-post', {shopTypes});
        });
    },
    postNewPost:(req,res)=>{
        if (!req.files || Object.keys(req.files).length === 0) {
            processFormData("")
        }else{
            var targetFile = req.files.target_file;
            var extName = path.extname(targetFile.name);
            var imgAllowedTypes = [".png",".jpg",".jpeg",".gif",".JPG",".JPEG",".PNG"];
            if(!imgAllowedTypes.includes(extName)){
                fs.unlinkSync(targetFile.tempFilePath);
                return res.status(422).send("Invalid Image");
            }
            targetFile.mv(path.join('public/images/', targetFile.name), (err) => {
                if (err)
                    return res.status(500).send(err);
                // res.send('File uploaded!');
            });
            var imagePath = '/images/'+targetFile.name;
            processFormData(imagePath)
        }
        function processFormData(imagePath){
            let {title, address, shopType, content,isPublic,tags} = req.body;
            isPublic = (isPublic == 'public')?true:false;
            Post.create({
                authorId:req.user.id,
                title:title,
                content:content,
                shopType:shopType,
                address:address,
                image:imagePath,
                isPublic:isPublic
            })
            .then(post => {
                var tagsArr = tags[0].split(",");
                async function getTags(tagsArr) {
                    var tagsId = [];
                    await Promise.all(tagsArr.map(tag => {
                        return Tag.findOrCreate({
                        where: {
                            tagName: tag
                        }
                    }).then(result=>{
                        tagsId.push(result[0].id);
                    })
                    }));
                    return tagsId;
                }
                getTags(tagsArr).then(tagsId=>{
                    var data = [];
                    tagsId.forEach(tagId => {
                        var postTag = {};
                        postTag['postId'] = post.id;
                        postTag['tagId'] = tagId;
                        data.push(postTag);
                    });
                    Post_Tag.bulkCreate(data)
                    .then(function(result) {
                        res.json({success : "Create Successfully", status : 200})
                    });
                });
            })
            .catch(error => res.status(422).json(error));
        }
 
    }
}