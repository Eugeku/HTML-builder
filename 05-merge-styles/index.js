const fs = require('fs');
const path = require('path');
const stylesFolderPath = path.join(__dirname, 'styles');
const outputBundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const outputStream = fs.createWriteStream(outputBundlePath);

fs.readdir(stylesFolderPath, (error, files) => {
  if (error) {
    console.error('Error reading the folder:', error);
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  if (cssFiles.length === 0) {
    console.log('No CSS files were found');
    outputStream.end();
    return;
  }

  console.debug('CSS files:', cssFiles);
  let filesProcessed = 0;

  cssFiles.forEach((file) => {
    const filePath = path.join(stylesFolderPath, file);

    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        console.error(`Error reading the file ${file}:`, error);
        return;
      }
      outputStream.write(data + '\n');
      console.debug(`Added contents of ${file}`);
      filesProcessed += 1;

      if (filesProcessed === cssFiles.length) {
        outputStream.end();
      }
    });
  });
});

outputStream.on('finish', () => {
  console.log('CSS files have been merged');
});

outputStream.on('error', (error) => {
  console.error('Error writing files:', error);
});
