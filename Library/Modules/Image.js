/*
  Uses the power of JIMP to save images.
  Has a single static function which can be called:
    writeText(outputPath : string, text : string, writeChar : string)
      Description: Writes the text to an image (using black where writeCharacter appears, white otherwise).
      Arguments:
        outputPath : String : The path to where the file should be saved
        text       : String : The data to write. Should be made up of two characters.
        characterColors  : Dictionary : Colors to use for each character in the string.
                                        Should have an additional property, default, to be used
                                          in case the character was not specified.

*/

let jimp = require("jimp");
class Image {
  // NOTE: This is reliant on all lines being of the same length
  static writeText(outputPath, text, characterColors){
    if (typeof (characterColors) === "string")
      characterColors = {
        characterColors: [0, 0, 0],
        default: [255, 255, 255]
      };

    let lines = text.split("\n");
    let lengthY = lines.length;
    let lengthX = lines[0] === undefined ? 0 : lines[0].length;

    let image = new jimp(lengthX, lengthY);
    for (let y = 0; y < lines.length; y++) {
      lines[y] = lines[y].split(""); // make it into an array - easier to check characters
      for (let x = 0; x < lines[y].length; x++) {
        let char = lines[y][x];
        let color = this._getColorOf(char, characterColors);

        image.setPixelColor(color, x, y);
      }
    }

    return image.writeAsync(outputPath);
  }

  static _getColorOf(character, colorsTable){
    if (!colorsTable[character])
      character = "default";

    return jimp.rgbaToInt(...colorsTable[character]);
  }
}

module.exports = Image;
