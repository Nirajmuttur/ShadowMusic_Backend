import mongoose,{Schema} from "mongoose";

const artistSchema = new Schema({
    spotifyArtistId:{
        type:String,
        required: true,
        unique: true
    },
    name:{
        type:String
    }

},{
    timestamps:true,
    _id:false
})

export const Artists = mongoose.model("Artists",artistSchema)