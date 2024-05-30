const fs = require('fs');
const path = require('path');

function createFile(fileName, content) {
    // Construct the absolute path to the file relative to the current directory
    const filePath = path.join(__dirname, '../doc/text/'+fileName);

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            return console.error('Error creating directory:', err);
        }

        // Create and write to the file asynchronously
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                return console.error('Error writing to file:', err);
            }
            console.log('File created and saved successfully!');
        });
    });
}

// Export the function for use in other modules
module.exports = { createFile };
