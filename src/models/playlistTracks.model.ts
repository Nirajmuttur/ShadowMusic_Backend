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
            ref: "Image"
        }
    ]
},{
    timestamps:true
})

export const PlayListTrack = mongoose.model("PlayListTrack",playlistTrackSchema)