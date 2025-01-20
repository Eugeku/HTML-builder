const fs = require('fs');
const path = require('path');

async function copyDir() {
  const sourceDirectory = path.join(__dirname, 'files');
  const targetDirectory = path.join(__dirname, 'files-copy');

  try {
    await fs.promises.mkdir(targetDirectory, { recursive: true });
    const files = await fs.promises.readdir(sourceDirectory, {
      withFileTypes: true,
    });
    const targetFiles = await fs.promises.readdir(targetDirectory, {
      withFileTypes: true,
    });

    for (let file of targetFiles) {
      await fs.promises.rm(path.join(targetDirectory, file.name), {
        recursive: true,
        force: true,
      });
    }

    for (let item of files) {
      const sourcePath = path.join(sourceDirectory, item.name);
      const targetPath = path.join(targetDirectory, item.name);

      if (item.isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
      } else {
        await fs.promises.copyFile(sourcePath, targetPath);
      }
    }

    console.log('Directory copied.');
  } catch (error) {
    console.error('Error during copying directory:', error);
  }
}

async function copyDirectory(source, target) {
  await fs.promises.mkdir(target, { recursive: true });
  const items = await fs.promises.readdir(source, { withFileTypes: true });

  for (let item of items) {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);

    if (item.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await fs.promises.copyFile(sourcePath, targetPath);
    }
  }
}

copyDir();
