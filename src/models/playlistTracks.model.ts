import mongoose,{Schema} from "mongoose";

const playlistTrackSchema = new Schema({
    name:{
        type:String
    },
    artist:[
        {
            type:Schema.Types.ObjectId,
            ref: "Artists"
        }
    ],
    albums:[
        {
            type: Schema.Types.ObjectId,
            ref: "ImageModel"
        }
    ],
    playlistId:{
        type: Schema.Types.ObjectId,
        ref: "Playlist"
    }
},{
    timestamps:true
})

export const PlayListTrackModel = mongoose.model("PlayListTrack",playlistTrackSchema)