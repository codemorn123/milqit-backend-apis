import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ipSchema = new mongoose.Schema(
    {
        day: String,
        time: String,
        ip: String,
    },
    { timestamps: true }
);

ipSchema.plugin(mongoosePaginate);

export default mongoose.model('ip', ipSchema, 'ip');
