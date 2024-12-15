import * as postService from '#services/post'

export async function createPost(req, res) {
    await postService.createPost(req, res)
}

export async function getListPosts(req, res) {
    await postService.getListPosts(req, res)
}

export async function getPostById(req, res) {
    await postService.getPostById(req, res)
}

export async function updatePost(req, res) {
    await postService.updatePost(req, res)
}

export async function deletePost(req, res) {
    await postService.deletePost(req, res)
}