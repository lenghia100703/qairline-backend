import * as userService from '#services/user'

export const getUserById = async (req, res) => {
    await userService.getUserById(req, res, req.params.id)
}

export const getCurrentUser = async (req, res) => {
    await userService.getCurrentUser(req, res)
}