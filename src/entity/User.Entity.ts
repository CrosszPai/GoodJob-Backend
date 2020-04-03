import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { SelectedEmployee } from './SelectedEmployee.Entity';
import { Comment } from './Comment.Entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: number;
    @Column()
    firstname!: string;

    @Column()
    lastname!: string;

    @Column({
        nullable: true,
    })
    phoneNumber?: string;

    @Column({
        nullable: true,
    })
    currentProvince?: string;

    @Column({
        nullable: true,
    })
    currnetRole!: 'employee' | 'employer';

    @Column({
        nullable: true,
    })
    gender?: 'male' | 'female';

    @Column({
        nullable: true,
    })
    idCard?: string;
    @ManyToMany(type => SelectedEmployee, selected => selected.id)
    @JoinTable()
    selected?: SelectedEmployee[]

    @ManyToMany(type=>Comment,comment=>comment.userID)
    comments?:Comment[]
}
