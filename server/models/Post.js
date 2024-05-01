const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  uid: {
    type:String,
    required:true,
  },
  content: {
    type:String,
    required:true
  },
  likes:{
    type:Array,
    default:[]
  },
  tags:{
    type:Array,
    default:[]
  },
  is_approved:{
    type:String,
    default:"pending",
    enum:["approved","rejected","pending"]
  }
  
}, {
  timestamps: true,
  collection: 'Posts',
});
postSchema.index({content:'text',tags:'text'})

module.exports = mongoose.model("Post", postSchema);
