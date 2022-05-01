export default function uuid ():string {
  let currentDate: number = new Date().getTime()
  const uuid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (match) => {
    const r: number = (currentDate + Math.random() * 16) % 16 | 0
    currentDate = Math.floor(currentDate / 16)
    return (match === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
