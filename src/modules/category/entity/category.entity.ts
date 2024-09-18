import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50})
    category_name: string

    @Column({ type: 'varchar', length: 200})
    description: string
}