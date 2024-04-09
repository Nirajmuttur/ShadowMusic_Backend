import mongoose,{Schema} from "mongoose";

const artistSchema = new Schema({
    spotifyArtistId:{
        type:String
    },
    name:{
        type:String
    }

},{
    timestamps:true
})

export const Artists = mongoose.model("Artists",artistSchema)