const fs = require('fs/promises');
const path = require('path');

async function displayInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (let file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileStats = await fs.stat(filePath);
        const fileSizeKb = (fileStats.size / 1024).toFixed(3);
        const fileExt = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, `.${fileExt}`);

        console.log(`${fileName} - ${fileExt} - ${fileSizeKb}kb`);
      }
    }
  } catch (error) {
    console.error('Error while reading:', error);
  }
}

displayInfo();
