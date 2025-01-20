const fs = require('fs');
const path = require('path');
const stylesFolderPath = path.join(__dirname, 'styles');
const outputBundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles(stylesFolder, outputCSSPath) {
  try {
    const files = await fs.promises.readdir(stylesFolder, {
      withFileTypes: true,
    });
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    if (cssFiles.length === 0) {
      console.log('No CSS files were found');
      return;
    }

    const cssContent = await Promise.all(
      cssFiles.map((file) =>
        fs.promises.readFile(path.join(stylesFolder, file.name), 'utf-8'),
      ),
    );

    await fs.promises.writeFile(outputCSSPath, cssContent.join('\n'));

    console.log('CSS files have been merged');
  } catch (error) {
    console.error('Error merging CSS files:', error);
  }
}

if (require.main === module) {
  mergeStyles(stylesFolderPath, outputBundlePath);
}

module.exports = { mergeStyles };
