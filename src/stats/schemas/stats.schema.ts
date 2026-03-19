// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { HydratedDocument } from 'mongoose';
// import { TransactionType } from 'src/common/enums/transaction-type.enum';

// export type StatsDocument = HydratedDocument<Stats>;

// @Schema({ timestamps: true })
// export class Stats {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ enum: TransactionType, required: true })
//   type: TransactionType;

//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
//   userId: mongoose.Types.ObjectId;
// }

// export const CategorySchema = SchemaFactory.createForClass(Stats);
