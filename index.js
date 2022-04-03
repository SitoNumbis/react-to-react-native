const fs = require("fs");

const paramDir = process.argv[2] || "./test";

// directory
const dir = fs.readdirSync("./test");

// result
const resultByFolder = {};

const parseReactFile = (file) => {
  let newContent = file;
  const a = "";
  // div to View
  while (newContent.indexOf("div") >= 0)
    newContent = newContent.replace("div", "View");
  // texts
  while (newContent.indexOf("h1") >= 0)
    newContent = newContent.replace("h1", "Text");
  while (newContent.indexOf("h2") >= 0)
    newContent = newContent.replace("h2", "Text");
  while (newContent.indexOf("h3") >= 0)
    newContent = newContent.replace("h3", "Text");
  while (newContent.indexOf("h4") >= 0)
    newContent = newContent.replace("h4", "Text");
  while (newContent.indexOf("h5") >= 0)
    newContent = newContent.replace("h5", "Text");
  while (newContent.indexOf("span") >= 0)
    newContent = newContent.replace("span", "</Text");
  while (newContent.indexOf("<p") >= 0)
    newContent = newContent.replace("</Text");
  // adding dependencies
  // text
  let deps = "";
  if (newContent.indexOf("View") >= 0) deps = "View";
  if (newContent.indexOf("Text") >= 0)
    deps += deps.length > 0 ? ", Text" : "Text";
  deps = `import { ${deps} } from "react-native";`;
  return deps + "\n" + newContent;
};

const parseFile = (name, content) => {
  if (name.indexOf(".jsx") >= 0) return parseReactFile(content);
  if (name.indexOf(".css") >= 0) return parseCssFile(content);
};

const readFolder = (folder, fullName) => {
  resultByFolder[fullName] = {};
  folder.forEach((item) => {
    const currentFullName = `${fullName}/${item}`;
    try {
      const content = fs.readFileSync(currentFullName, {
        encoding: "utf-8",
      });
      resultByFolder[fullName][currentFullName] = content;
    } catch (err) {
      const subfolder = fs.readdirSync(currentFullName);
      if (subfolder.length) readFolder(subfolder, currentFullName);
    }
  });
};

const createNewDirectory = () => {
  // creating result folder
  fs.mkdirSync(`${paramDir}/result`);
  // creating files and sub folders
  // getting sub folders
  const subFolders = Object.keys(resultByFolder);
  subFolders.forEach((item) => {
    fs.mkdirSync(`${paramDir}/result${item.substring(1)}`);
    // getting files from current sub folder
    const files = Object.keys(resultByFolder[item]);
    files.forEach((jtem) => {
      const content = parseFile(jtem, resultByFolder[item][jtem]);
      fs.writeFileSync(`${paramDir}/result${jtem.substring(1)}`, content);
    });
  });
};

readFolder(dir, paramDir);
createNewDirectory();
console.log(resultByFolder);
console.log(paramDir);
