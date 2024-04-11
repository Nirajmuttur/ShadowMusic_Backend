import Artist from "./Artist";
import Image from "./Image"
interface PlayListTrack {
    track: {
        id:string,
        name: string;
        artists: Artist[],
        album:{
            images:Image[]
        }
    }
}

export default PlayListTrack