import mongoose, { Schema } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const videoSchema = new mongoose.Schema({

    videoFile: { 
        type: String, //Claudinary ka use karke video upload karenge
        required: true
    }, 
    thumbnail: { 
        type: String, //Claudinary ka use karke thumbnail upload karenge
        required: true
    }, 

    title: { 
        type: String,
        required: true,
        trim: true,
        index: true
    }, 

    discription: {

        type: String, 
        required: true
    },
    duration: { 
        type: Number, //duration nikalenge cloudinary se jab video upload karenge
        required: true
    },

    views: {
        type: Number,
        default: 0
    },

    isPublished: { 
        type: Boolean,
        default: true
    },

    owner : { 
        type: Schema.Types.ObjectId, 
        ref: "User"
    }

},{
    timestamps: true
});

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);