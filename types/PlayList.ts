interface PlayList{
    track: {
        name: string;
        artists: [{
            name: string;
        }],
        images:[{
            height: number,
            url: string;
            width: number;
        }]
    }
}

export default PlayList