import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  createdAt: { type: Date, default: Date.now }
});

const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
export const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);
export const Flashcard = mongoose.models.Flashcard || mongoose.model('Flashcard', flashcardSchema);
