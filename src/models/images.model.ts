import mongoose,{Schema} from "mongoose";

const imageSchema = new Schema({
    height:{
        type: Number
    },
    url:{
        type:String
    },
    width:{
        type: Number
    }
},{
    timestamps:true
})

export const ImageModel = mongoose.model("ImageModel",imageSchema)