import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column({ name: 'film_id', type: 'varchar', length: 64 })
  filmId: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id' })
  film: FilmEntity;

  @Column({ type: 'timestamptz' })
  daytime: Date;

  @Column({ type: 'integer' })
  hall: number;

  @Column({ type: 'integer' })
  rows: number;

  @Column({ type: 'integer' })
  seats: number;

  @Column({ type: 'integer' })
  price: number;

  @Column('text', { array: true, default: '{}' })
  taken: string[];
}
