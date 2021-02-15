const path = require('path');
const fs = require('fs');

const clearImage = (filePath) => {
    // console.log('@clearImage() filePath input>: ', filePath);
    filePath = path.join(__dirname, '..', filePath);
    // console.log('@clearImage() __dirname>: ', __dirname);
    // console.log('@clearImage() filePath generated to delete>: ', filePath);
    fs.unlink(filePath, err => console.log('@clearImage() err>: ', err));
}

exports.clearImage = clearImage;