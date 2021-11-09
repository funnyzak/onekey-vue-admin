export function logger() {
  if (process.env.NODE_ENV === 'development') {
    console.log(arguments)
  } else {
    return
  }
}

