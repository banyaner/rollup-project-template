/**
 * Created by zhongjx on 2019-01-26.
 */
const test = () => {
  if (process.browser) {
    console.log(1)
  } else {
    console.log(2)
  }
}
new Promise(res => {
  res(1)
})



const arr = Array.from(1, 2, 3)
console.log([...arr])
export { test }
