const fs = require('fs');

console.log(1);

// Use a função fs.readFile com um callback


// function callback(err, contents) {
//     console.log(err, contents);
// }


// fs.readFile('./arquivo.txt', (err, contents) => {
    
//     fs.readFile('./arquivo2.txt', (err2, contents2) => {
//         console.log(err, String(contents));
//         console.log(err2, String(contents2));
//     })
// });

// O problema disso é que se tivermos muitos callbacks, o código fica muito confuso
// e difícil de ler. Para resolver isso, usamos Promises.

const readFile = file => new Promise ((resolve, reject) => {
    fs.readFile(file, (err, contents) => {
        if(err) {
            reject(err);
        } else {
            resolve(contents);
        }
    })
})

// readFile('./arquivo.txt')
//     .then(contents => {
//     console.log(String(contents));
//     return readFile('./arquivo2.txt');
// })
//     .then(contents => {
//     console.log(String(contents));
// })

// setTimeout(( ) => console.log(promessa), 1000)


const init = async() => {
    try {
    const contents1 = await readFile('./arquivo.txt');
    const contents2 =  await readFile('./arquivo2.txt');
    return String(contents1) + '\n' + String(contents2);
    }catch(err) {
        console.log(err);
    }
}

init().then(contents => console.log(contents));

console.log(2);
console.log(3);

// O problema disso 