export default function (val: number): string {
  return new Intl.NumberFormat('en-EN').format(val)
}
