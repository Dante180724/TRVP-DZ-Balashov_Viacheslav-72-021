import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Courier } from './Courier';

@Entity('delivery_tasks')
export class DeliveryTask {
  @PrimaryColumn()
  id!: string;

  @Column()
  orderDescription!: string;

  @Column({ type: 'integer' })
  cellsOccupied!: number;

  @Column()
  deliveryDistrict!: string;

  @Column()
  deliveryAddress!: string;

  @Column()
  courierId!: string;

  @ManyToOne(() => Courier, (courier) => courier.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courierId' })
  courier!: Courier;
}
