import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('districts')
export class District {
  @PrimaryColumn()
  name!: string;
}
