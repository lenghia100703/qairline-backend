import * as authService from '#services/auth'

export const register = async (req, res) => {
    await authService.register(req, res)
}

export const login = async (req, res) => {
    await authService.login(req, res)
}

export const logout = async (req, res) => {
    await authService.logout(req, res)
}

export const refreshToken = async (req, res) => {
    await authService.refreshToken(req, res)
}