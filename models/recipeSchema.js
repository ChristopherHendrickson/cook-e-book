const mongoose = require('mongoose')
const Schema = mongoose.Schema

const componentSchema = new Schema({
    raw_text:String,
    ingredient:{
        name:String,
        displaySingular:String,
        displayPlural:String
    },
    measurement:{
        quantity:String,
        unit:String,
        unitAbbreviation:String,
    }
})


const recipeSchema = new Schema({
    name:{type:String, required:true},
    apiID:Number,
    userID:{type:Schema.Types.ObjectId,  ref: "User", required:true},
    components:[componentSchema],
    instructions:[String],
    favourite:{type:Boolean, required:true},
    active:{type:Boolean, required:true},
    tags:[{
        type:{type:String},
        name:String
    }],
    numServings:Number,
    thumbnailURL:String
})

module.exports = recipeSchema

