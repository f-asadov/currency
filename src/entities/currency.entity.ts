import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  charCode: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int' })
  nominal: number;

  @Column({ type: 'varchar', length: 50 })
  currencyId: string;

  @Column({ type: 'json' })
  history: { date: string; value: number }[]; 
}
