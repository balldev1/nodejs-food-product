// manage routing
const express = require('express')
const router = express.Router()
// use model 
const Product = require('../models/products')
// upload file
const multer =require('multer')

// upload..
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/products') //position save file 
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'.jpg') //change name file prevent repeat
    }
})

// start upload...
const upload = multer({
    storage:storage
})

router.get('/', async (req, res) => {
    // try {
      const products = await Product.find().exec();
      res.render('index', { products });
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send(error);
    // }
  });


router.get('/add-product',(req,res)=>{
    if(req.session.login){
        res.render('form')
    }else{
        res.render('admin')
    }
    res.render('admin')
})

router.get('/manage', async (req,res)=>{
    if(req.session.login){
        const products = await Product.find().exec();
        res.render('manage', { products });
    }else{
        res.render('admin')
    }
  });

 // logout
router.get('/logout',async(req, res) => {
    req.session.destroy((err)=>{
        res.redirect('/manage')
    })
}) 

router.get('/delete/:id', async (req,res)=>{
    // try {
      const products = await Product.findByIdAndDelete(req.params.id).exec();
      res.redirect('/manage');
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).send(error);
    // }
  });

router.post('/insert', upload.single('image'),async (req, res) => {
    // try {
      const data = new Product({
        name: req.body.name,
        price: req.body.price,
        image: req.file.filename,
        description: req.body.description
      });
      await data.save();
      res.redirect('/');
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).send('Error saving product');
    // }
  });

router.get('/:id',async (req,res)=>{
    // try{
    const product_id =req.params.id
    const product = await Product.findOne({_id:product_id}).exec()
    res.render('product',{product:product})
// } catch (error){
//     console.log(error);
//     res.status(500).send(error)
// }
})

router.post('/edit',async(req, res) => {
    // try{
    const edit_id = req.body.edit_id
    const product = await Product.findOne({_id:edit_id}).exec()
    res.render('edit',{product:product})
// } catch (error){
//     console.log(error);
//     res.status(500).send(error)
// }
})

router.post('/update',async(req, res) => {
    // data new  export edit
    const update_id = req.body.update_id;
    const data = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    }
    //update data
    const product = await Product.findByIdAndUpdate(update_id, data, {
        useFindAndModify: false,
      }).exec();
      res.redirect('/manage');
})


// login
router.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const timeExpire = 100000000 // 30 sec

    if(username == 'admin' && password == '123'){
        //cre cookie
        // res.cookie('username',username,{maxAge:timeExpire})
        // res.cookie('password',password,{maxAge:timeExpire})
        // res.cookie('login',true,{maxAge:timeExpire}) // true == login false = not login

        //cre session
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge=timeExpire
        res.redirect('/manage')
    }else{
        res.render('404')
    }
})



module.exports = router
