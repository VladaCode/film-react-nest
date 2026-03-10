import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity({ name: 'films' })
export class FilmEntity {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  @Column({ type: 'real' })
  rating: number;

  @Column({ type: 'text' })
  director: string;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'text' })
  cover: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  about: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film)
  schedule: ScheduleEntity[];
}
