import {Request, Response} from "express";
import {createComment, getAllComment, updateComment} from "../model/comment.model";

export class CommentController {
    static async postComment(req: Request, res: Response) {
        let jobId = req.params['id'];
        let {content} = req.body;
        if (!jobId) {
            console.log(jobId);

            return res.status(401)
                .send('bad request')
        }
        let u = await createComment(jobId, content);
        res.json(u)
    }

    static async replyComment(req: Request, res: Response) {
        let commentID = req.params['comment'];
        let {reply} = req.body;
        if (!reply) {
            return res.status(401)
                .send('Bad request')
        }
        let u = await updateComment(commentID, {
            reply: reply
        });
        res.json(u)
    }

    static async getComments(req: Request, res: Response) {
        let jobId = req.params['id'];
        if (!jobId) {
            return res.status(401)
                .send('Bad request')
        }
        let posts = await getAllComment(jobId);
        res.json(posts)
    }
}
