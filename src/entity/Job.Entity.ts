import { Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Comment } from './Comment.Entity';
import { SelectedEmployee } from './SelectedEmployee.Entity';

@Entity()
export class Job {
    @PrimaryGeneratedColumn('uuid')
    jobID!: number;
    @Column()
    description?: string
    @Column('timestamptz')
    startDate?: Date
    @Column('timestamptz')
    finishDate?: Date
    @Column("int", {
        array: true,
    })
    Location?: number[]
    @Column()
    mode?: 'auto' | 'manual'
    @Column("varchar", {
        array: true
    })
    position?: string[]
    @Column('int', {
        array: true
    })
    posWage?: number[]
    @Column('int', {
        array: true,
    })
    posReq?: number[]
    @Column('boolean')
    end?: boolean

    @OneToMany(type=>SelectedEmployee,selected=>selected.job)
    selectedEmployees?:SelectedEmployee[]
    @OneToMany(type=>Comment,comment=>comment.job)
    comments?:Comment[]
}
