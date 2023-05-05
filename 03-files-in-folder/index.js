const fs = require('fs/promises');
const path = require('path');

const DIRECTORY_NAME = 'secret-folder';
const directoryPath = path.join(__dirname, DIRECTORY_NAME);

function getFileInfo(fileName, { size }) {
  let { name, ext } = path.parse(fileName);
  ext = ext.length !== 0 ? ext.slice(1) : '[no ext]';
  const fileSizeInKb = (size / 1000).toFixed(3);
  return `${name} - ${ext} - ${fileSizeInKb}Kb`;
}

async function processFile(filePath) {
  const fileDetails = await fs.stat(filePath);
  return getFileInfo(filePath, fileDetails);
}

async function readDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const filesDetails = await Promise.all(
      files
        .filter((file) => file.isFile())
        .map(({ name }) => processFile(path.join(dirPath, name)))
    );
    console.log(filesDetails.join('\n'));
  } catch (err) {
    console.error(err);
  }
}

readDirectory(directoryPath);
