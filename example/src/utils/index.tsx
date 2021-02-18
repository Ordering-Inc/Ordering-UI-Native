/**
 * Function to convert delivery time in minutes
 * @param {string} time business delivery time
 */
export const convertHoursToMinutes = (time: any) => {
    if (!time) return '0min'
    const [hour, minute] = time.split(':')
    const result = (parseInt(hour, 10) * 60) + parseInt(minute, 10)
    console.log(result)
    return `${result}min`
  }
  