let dailyCounter = 0
let lastResetDate = null

export const genericNumberFlight = () => {
    const today = new Date()
    const currentDate = today.toISOString().slice(0, 10)
    if (lastResetDate !== currentDate) {
        dailyCounter = 0
        lastResetDate = currentDate
    }
    const incrementPart = dailyCounter++
    const day = today.getDate().toString().padStart(2, '0')
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    const year = today.getFullYear().toString().slice(2, 4)
    const datePart = `${day}${month}${year}`
    return `QA${datePart}${incrementPart.toString().padStart(2, '0')}`
}