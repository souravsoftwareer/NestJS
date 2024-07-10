import { PrimaryGeneratedColumn, BaseEntity, Column, Entity, CreateDateColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type:'int',default:0 })
  active: number;

  @Column({default:''})
  eotp:string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

}