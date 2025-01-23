import fs from 'fs';

// // writefile
// fs.writeFile('aadi.txt', 'my name is aditya tiwari', (err) => {
//     if (err) throw err;
//     console.log('file created');
// });

// // add the text or append text in aadi.txt file
// fs.appendFile('aadi.txt', ' new file text test', (err) => {
//     if (err) throw err;
//     console.log('file appended');
// })

// // // 
// fs.copyFile('aadi.txt', './copy/copyfile.txt', (err) => {
//     if (err) throw err;
//     console.log('file copied successfully');
// })

// fs.unlink('./copy/copyfile.txt', (err) => {
//     if (err) throw err;
//     console.log('file deleted successfully')
// })

fs.readFile('./copy/copyfile.txt', (err, data) => {
    if (err) throw err;
    console.log(data.toString()); // Convert buffer to string
})