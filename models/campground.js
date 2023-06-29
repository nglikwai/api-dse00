const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: {
        type: String,
        default: '如題'
    },
    favour: {
        type: Number,
        default: 0
    },
    popular: {
        type: Number,
        default: 0
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: '622874ccc8ed254d82edf591'
    },
    category: {
        type: String,
        default: '吹水'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    display_name: {
        type: String,
        default: 'DSEJJ'
    },
    post_group: {
        type: String
    },
    ip: {
        type: String
    }
}, { timestamps: true }, opts);


CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Campground', CampgroundSchema);