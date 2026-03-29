import mongoose, { Schema, Model, Types } from 'mongoose';

export interface ISubject {
  name: string;
  description?: string;
  createdAt: Date;
}

export interface ITopic {
  name: string;
  subjectId: Types.ObjectId;
  createdAt: Date;
}

export interface IFlashcard {
  question: string;
  answer: string;
  topicId: Types.ObjectId;
  createdAt: Date;
}

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const topicSchema = new Schema<ITopic>({
  name: { type: String, required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  createdAt: { type: Date, default: Date.now },
});

const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Subject: Model<ISubject> =
  (mongoose.models.Subject as Model<ISubject>) || mongoose.model<ISubject>('Subject', subjectSchema);
export const Topic: Model<ITopic> =
  (mongoose.models.Topic as Model<ITopic>) || mongoose.model<ITopic>('Topic', topicSchema);
export const Flashcard: Model<IFlashcard> =
  (mongoose.models.Flashcard as Model<IFlashcard>) ||
  mongoose.model<IFlashcard>('Flashcard', flashcardSchema);
