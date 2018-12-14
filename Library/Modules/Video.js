let Videoshow = require("videoshow");

class Video {
  static create(path, images){
    return new Promise ((fulfill, reject) => {
      // Creates a video from a series of images
      Videoshow(images, {
        transition: false,
        loop: 0.1 // seconds
      }).save(path)
        .on('start', (msg)=>console.log("Starting video creation:", msg))
        .on('error', (err)=>reject(err))
        .on('end', (output)=>fulfill(output));
    });
  }
}

module.exports = Video;
