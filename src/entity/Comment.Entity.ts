import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Job } from "./Job.Entity";
import { User } from "./User.Entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id!: number;
    @ManyToOne(type => Job, job => job.comments)
    job?: Job
    @ManyToMany(type => User, user => user.comments)
    @JoinTable()
    userID?: User[]
}