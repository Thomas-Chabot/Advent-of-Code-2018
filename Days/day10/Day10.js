/*
	This is the main program for Day 10, written in JavaScript for NodeJS.

	Exercise input should be stord inside input/input.txt
	Output images will be written to output/data[INDEX].png

	Output images will be used to store the data of the points for a given second.
	To find the solution for Part 1, these image files should be searched through until the
	  message is found. This will be wherever there is clear text in the image.
	To find the solution for Part 2, the NodeJS output will indicate the second that each
	  image snapshot was taken. Find your specific image, line it up with the second, and that
		will be your result.
*/

/* Constants */
let WRITE_CHARACTER = "*";

/* Dependencies */
let File = require ("./modules/File.js");
let Image = require ("./modules/Image.js");

/* UI */
let UI = require ("./modules/UI.js");

File.read("./input/input.txt").then((contents) => {
	let ui = new UI(contents, WRITE_CHARACTER)
	let curIndex = 0

	ui.run((data, secondsPassed)=>{
		// Has to do with Part 2 solution
		console.log (`Index ${curIndex} has occured after ${secondsPassed} seconds`);

		let path = "./output/data" + curIndex + ".png";
		curIndex ++;

		// Writes it to an image - these can be viewed to detect the message
		// NOTE: Only writes the image if all points are visible; this cuts down on the clutter
		return Image.writeText(path, data, WRITE_CHARACTER);
	});
});
