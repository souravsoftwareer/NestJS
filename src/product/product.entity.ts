import { PrimaryGeneratedColumn, BaseEntity, Column, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ObjectIdColumn() // for mongodb
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: string;
}