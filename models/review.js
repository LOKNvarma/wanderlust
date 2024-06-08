const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const reviewSchema = new Schema({
    ratings :{
        type : Number,
        min : 1,
        max :5
    },
    comment : String,
    createAt :{
        type : Date,
        default : Date.now()
    },
    rowner :{
        type : Schema.Types.ObjectId,
        ref  : 'User'
    }
});
const Review = mongoose.model("Review",reviewSchema);
module.exports = Review ;