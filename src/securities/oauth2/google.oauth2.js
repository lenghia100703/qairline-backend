export async function google(token) {
    const searchParams = new URLSearchParams({ access_token: token })
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?${searchParams}`
    const response = await fetch(url)
    const { sub, name, email, picture } = await response.json()
    return {
        service: 'google',
        picture,
        id: sub,
        name,
        email,
    }
}