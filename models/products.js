// use mongoose
const mongoose = require('mongoose')

// route mongodb
const dbUrl = 'mongodb://127.0.0.1:27017/productDB'
mongoose.connect(dbUrl,{
    useNewUrlParser:true, 
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// design schema
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

//create modle

let Product = mongoose.model('products',productSchema)

//export model
module.exports = Product

// design save product
module.exports.saveProduct = function(model,data){
    model.save(data)
}