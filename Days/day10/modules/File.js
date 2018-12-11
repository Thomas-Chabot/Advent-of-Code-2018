/*
  The File class. This allows for reading & writing of files from the file system.
*/

var fs = require ("fs");

class File {
  static read (filePath) {
    return new Promise((fulfill, reject) => {
      fs.readFile (filePath, (err, contents) => {
        if (err) reject (err);
        else {
          fulfill (contents.toString ());
        }
      });
    });
  }

  static write (filePath, data) {
    return new Promise ((fulfill, reject) => {
      fs.writeFile (filePath, data, (err) => {
        if (err) reject (err);
        fulfill ();
      });
    });
  }
}

module.exports = File;
