import httpStatus from 'http-status'
import { PAGE, PER_PAGE } from '#constants/pagination'
import Post from '#models/post'
import Plane from '../models/plane.model.js'

export const getListPosts = async (req, res) => {
    try {
        let {page, perPage, type} = req.query
        if (!page || !perPage) {
            page = PAGE
            perPage = PER_PAGE
        }
        const filter = {}
        if (type) {
            filter.type = type
        }
        let posts, totalPosts
        if (parseInt(perPage, 10) === -1) {
            posts = await Post.find(filter)
            totalPosts = posts.length
        } else {
            const skip = (page - 1) * perPage
            const limit = parseInt(perPage, 10)
            posts = await Post.find(filter).skip(skip).limit(limit)
            totalPosts = await Post.countDocuments(filter)
        }
        return res.status(httpStatus.OK).json({
            data: posts,
            page: parseInt(page, 10),
            totalPages: perPage === -1 ? 1 : Math.ceil(totalPosts / perPage),
            message: 'Lấy danh sách bài viết thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách bài viết'
        })
    }
}

export const createPost = async (req, res) => {
    try {
        const post = new Post(req.body)
        await post.save()
        return res.status(httpStatus.CREATED).json({
            data: post,
            message: 'Tạo bài viết thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.BAD_REQUEST).json({
            message: 'Lỗi khi tạo bài viết',
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            req.body,
            { new: true },
        )
        if (!updatedPost) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy bài viết',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Cập nhật bài viết thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật bài viết',
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params
        const deletedPost = await Post.findByIdAndDelete(postId)
        if (!deletedPost) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy bài viết',
            })
        }
        return res.status(httpStatus.OK).json({
            message: 'Xóa bài viết thành công',
        })
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa bài viết',
        })
    }
}

export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'Không tìm thấy bài viết',
            })
        }
        return res.status(httpStatus.OK).json({
            data: post,
            message: 'Lấy thông tin bài viết thành công',
        })
    } catch (e) {
        return res.status(e.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tìm bài viết',
        })
    }
}