import { ObjectId } from "mongodb";
import { PrimaryGeneratedColumn, BaseEntity, Column, Entity, CreateDateColumn, ObjectIdColumn, BeforeInsert } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() // for mysql
  @ObjectIdColumn() // for mongodb
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

  @BeforeInsert()
  setDefaults() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

}