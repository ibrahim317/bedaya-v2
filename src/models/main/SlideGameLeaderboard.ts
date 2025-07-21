import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlideGameLeaderboard extends Document {
  ip: string;
  bestMoves: number;
  lastPlayed: Date;
  createdAt: Date;
  name?: string;
}

const SlideGameLeaderboardSchema: Schema = new Schema({
  ip: { type: String, required: true, unique: true },
  bestMoves: { type: Number, required: true },
  lastPlayed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  name: { type: String },
});

const SlideGameLeaderboard: Model<ISlideGameLeaderboard> =
  mongoose.models.SlideGameLeaderboard || mongoose.model<ISlideGameLeaderboard>('SlideGameLeaderboard', SlideGameLeaderboardSchema);

export default SlideGameLeaderboard; 