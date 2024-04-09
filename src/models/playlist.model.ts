import mongoose,{Schema} from "mongoose";

const playListSchema = new Schema({
    spotifyPlayListId:{
        type: String
    },
    name:{
        type:String
    },
    images:[
        {
            type: Schema.Types.ObjectId,
            ref: "ImageModel"
        }
    ]
},{
    timestamps:true

})

export const Playlist = mongoose.model("Playlist",playListSchema)