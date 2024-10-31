import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  //自增列
  @PrimaryGeneratedColumn()
  id: number;
  //普通列
  @Column()
  name: string;
  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'int' })
  age: number;

  @CreateDateColumn({ type: 'timestamp' })
  create_time: Date;
}
