import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Job } from "./Job.Entity";
import { User } from "./User.Entity";

@Entity()
export class SelectedEmployee {
    @PrimaryGeneratedColumn('uuid')
    id!: number
    @ManyToOne(type => Job, job => job.selectedEmployees)
    job?: Job
    @ManyToMany(type => User, user => user.id)
    @JoinTable()
    users?: User[]
}