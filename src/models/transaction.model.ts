import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const transactionSchema = new mongoose.Schema(
    {
        day: String,
        time: String,
        app: String,
        method: String,
        url: String,
        env: String,
        ip: String,
        host: String,
        hostReq: String,
        responseTime: Number,
        status: Number,
        message: String,
        contentLength: Number,
        gid: String,
    },
    { timestamps: true }
);

transactionSchema.plugin(mongoosePaginate);

export default mongoose.model('transaction', transactionSchema, 'transaction');
