let p = new Promise((resolve, reject) =>{
    let a = 1 + 3
    if (a == 2) {
        resolve('Sucess')
    } else {
        reject('failed')
    }
})

p.then((message)=> {
    console.log("This is the then " + message)
}).catch((mesaage) =>{
    console.log("This is the catch " + mesaage)
})