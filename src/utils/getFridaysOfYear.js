export const getFridaysOfYear = (year) => {
  const fridays = []
  const startDate = new Date(`${year}-01-01`)
  const endDate = new Date(`${year}-12-31`)

  let current = new Date(startDate)

  while (current <= endDate) {
    if (current.getDay() === 5) {
      fridays.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }

  return fridays
}
