// const { Embed, ButtonComponent, SelectMenuComponent } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const readdirRecursive = require("recursive-readdir");

readdirRecursive(process.cwd()).then(async (paths) => {
  paths = paths.filter(x => !x.includes("jsconfig") && !x.includes("package") && !x.includes("LICENSE") && !x.includes("v14-") && !x.includes("yarn.lock") && !x.includes("node_modules") && !x.includes(".git"));
  firstLoop: for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    let content = readFileSync(path).toString();
    let upperCaseList = content.match(/\"[A-Z_]+\"|\'[A-Z_]+\'|\`[A-Z_]+\`/g);
    let fixSize = 0;
    secondLoop: for (let j = 0; j < upperCaseList?.length; j++) {
      fixSize++;
      let oldWord = upperCaseList[j];
      let newWord = "\"" + upperToCamel(oldWord.match(/[A-Z_]+/)?.shift()) + "\"";
      content = content.replace(oldWord, newWord);
    }
    content = content.replace(/PermissionString/g, "PermissionResolvable");
    content = content.replace(/MessageEmbed|EmbedBuilder|Embed/g, "EmbedBuilder");
    content = content.replace(/MessageButton|ButtonBuilder|ButtonComponent/g, "ButtonBuilder"); 
    content = content.replace(/MessageSelectMenu|SelectMenuBuilder|SelectMenuComponent/g, "SelectMenuBuilder"); 
    writeFileSync(path, content);
    console.log(path.replace(process.cwd(), ""), `${i}/${paths.length}`, fixSize)
  }

});

function upperToCamel(word) {

  let nextUp = true;
  let newWord = "";
  for (let i = 0; i < word.length; i++) {

    let char = word[i];

    if (char == "_") {
      nextUp = true;
    } else if (nextUp) {
      newWord += char.toUpperCase();
      nextUp = false;
    } else {
      newWord += char.toLowerCase();
    }

  }
  return newWord
}