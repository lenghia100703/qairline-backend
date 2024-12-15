import express from 'express'
import * as postController from '#controllers/post'
import { authorize } from '#middlewares/auth'
import { ROLES } from '#constants/role'

const router = express.Router()


router
    .route('')
    .get(postController.getListPosts)
    .post(authorize([ROLES.ADMIN]), postController.createPost)

router
    .route('/:postId')
    .get(postController.getPostById)
    .put(authorize([ROLES.ADMIN]), postController.updatePost)
    .delete(authorize([ROLES.ADMIN]), postController.deletePost)

export default router