export interface Job {
    title: string,
    description: string,
    start_date: Date,
    finish_date: Date,
    location: number[],
    mode: 'auto' | 'manual',
    position: string[],
    posWage: number[],
    posReq: number[],
}
