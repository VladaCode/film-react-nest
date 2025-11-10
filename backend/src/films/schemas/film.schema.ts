import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Схема Mongoose для сеанса фильма
 * Соответствует структуре SessionDto
 */

// @Prop - декоратор для определения свойств схемы Mongoose
// Создает поле в MongoDB коллекции с указанными настройками
@Schema({ _id: false })
export class Session {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  daytime: string;

  @Prop({ required: true })
  hall: number;

  @Prop({ required: true })
  rows: number;

  @Prop({ required: true })
  seats: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  taken: string[];
}

/**
 * Схема Mongoose для фильма
 * Соответствует структуре FilmDto
 */
@Schema()
export class Film extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Session], required: true })
  schedule: Session[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
