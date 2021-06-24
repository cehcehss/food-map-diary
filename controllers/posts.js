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
            let {title, address, shopType, content,isPublic} = req.body;
            isPublic = (isPublic == 'public')?true:false;
            Post.create({
                authorId:"1",
                title:title,
                content:content,
                shopType:shopType,
                address:address,
                image:imagePath,
                isPublic:isPublic
            })
            .then(post => res.redirect('/'))
            .catch(error => res.status(422).json(error));
        }

 
        // retrieve error message from express-validator
        // const errors = validationResult(req)
        // error messages exist
        // if (!errors.isEmpty()) {
        //     return res.status(422).render('add-post', {
        //     postFormCSS: true,
        //     formValidation: true,
        //     warning: errors.array(),
        //     post: {title, address, shopType, content,image}
        //     })
        // }
 
    },
}