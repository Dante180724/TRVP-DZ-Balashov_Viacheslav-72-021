import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { DeliveryTask } from './DeliveryTask';

@Entity('couriers')
export class Courier {
  @PrimaryColumn()
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  workDistrict!: string;

  @Column({ type: 'integer', default: 10 })
  maxCells!: number;

  @OneToMany(() => DeliveryTask, (task) => task.courier)
  tasks!: DeliveryTask[];

  getOccupiedCells(): number {
    if (!this.tasks) return 0;
    return this.tasks.reduce((sum, task) => sum + task.cellsOccupied, 0);
  }

  getAvailableCells(): number {
    return this.maxCells - this.getOccupiedCells();
  }
}
