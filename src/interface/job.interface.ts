import { Position } from "./position.interface";

export interface Job {
    title: string,
    description: string,
    start_date: Date,
    finish_date: Date,
    location: number[],
    mode: 'auto' | 'manual',
    positions: Array<Position>
}
