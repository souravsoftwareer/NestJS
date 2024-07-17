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

  @Column()
  active: number = 0;

  @Column()
  eotp: string=''

  @Column()
  createdOn: Date = new Date();
 
}