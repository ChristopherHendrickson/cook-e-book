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
    created:Date,
    lastUpdated:Date,
    apiID:Number,
    userID:{type:Schema.Types.ObjectId,  ref: "User", required:true},
    components:[componentSchema],
    instructions:[String],
    favourite:{type:Boolean, required:true},
    active:{type:Boolean, required:true},
    tags:[{
        type:{type:String},
        name:String,
        display_name:String
    }],
    totalPrepTime:Number,
    numServings:Number,
    thumbnailURL:String
})

module.exports = recipeSchema

