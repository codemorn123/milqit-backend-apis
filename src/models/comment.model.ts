import mongoose, { Schema, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBase } from './base';

export interface IComment {
    reelId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
    isActive: boolean;
}

export interface ICommentDocument extends IComment, IBase { }

export interface CommentModel extends PaginateModel<ICommentDocument> { }

const CommentSchema = new Schema<ICommentDocument>(
    {
        reelId: {
            type: Schema.Types.ObjectId,
            ref: 'Reel',
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret: any) => {
                delete ret.__v;
            },
        },
    }
);

CommentSchema.plugin(mongoosePaginate);

export const CommentModel = mongoose.model<ICommentDocument, CommentModel>('Comment', CommentSchema);
