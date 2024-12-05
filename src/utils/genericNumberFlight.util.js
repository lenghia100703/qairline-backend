export const genericNumberFlight = () => {
    const today = new Date()
    const datePart = today.toISOString().slice(2, 10).replace(/-/g, '')
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase()
    return `${datePart}${randomPart}`
}