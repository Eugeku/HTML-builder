const fs = require('fs');
const path = require('path');
const { copyDirectory } = require('../04-copy-directory/index.js');
const { mergeStyles } = require('../05-merge-styles/index.js');

const projectDist = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const assetsFolder = path.join(__dirname, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const outputHTMLPath = path.join(projectDist, 'index.html');
const outputCSSPath = path.join(projectDist, 'style.css');
const outputAssetsFolder = path.join(projectDist, 'assets');

async function buildHTML() {
  let template = await fs.promises.readFile(templatePath, 'utf-8');
  const tags = template.match(/{{\s*[\w-]+\s*}}/g) || [];

  for (const tag of tags) {
    const componentName = tag.replace(/{{\s*|\s*}}/g, '');
    const componentPath = path.join(componentsFolder, `${componentName}.html`);

    try {
      const componentContent = await fs.promises.readFile(
        componentPath,
        'utf-8',
      );
      template = template.replace(new RegExp(tag, 'g'), componentContent);
    } catch {
      console.error(`Component file ${componentName}.html not found.`);
    }
  }

  await fs.promises.writeFile(outputHTMLPath, template);
}

async function buildProject() {
  try {
    await fs.promises.mkdir(projectDist, { recursive: true });

    await buildHTML();
    console.log('HTML built successfully.');

    await mergeStyles(stylesFolder, outputCSSPath);
    console.log('Styles merged successfully.');

    await copyDirectory(assetsFolder, outputAssetsFolder);
    console.log('Assets copied successfully.');
  } catch (error) {
    console.error('Error during project build:', error);
  }
}

buildProject();
