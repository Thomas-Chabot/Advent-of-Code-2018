/*
 * This is a translated version of the ElfCode program written in JavaScript.
 * It runs immensely faster than the interpreted version & should be used instead..
 * Will still provide the same results.
 */

function main(){
  let Registers = [0, 0, 0, 0, 0, 0];
  let storedValues = { };
  let i = 0;

  let part1Result = null;
  let part2Result = null;
  let lastValue = null;

  let record = (value)=>{
    if (storedValues[value]){
      part2Result = lastValue;
      return false;
    }

    if (!part1Result)
      part1Result = value;

    storedValues[value] = true;
    lastValue = value;
  }

  // this is the ElfCode translated into JavaScript
  while (true) {
  	Registers[5] = Registers[2] | 65536;
  	Registers[2] = 16123384;
  	while (true) {
  		Registers[3] = Registers[5] & 255;
  		Registers[2] += Registers[3];
  		Registers[2] = Registers[2] & 16777215;
  		Registers[2] *= 65899;
  		Registers[2] = Registers[2] & 16777215;

  		if (Registers[5] < 256)
  			break;

      // optimized version of the for loop
  		Registers[5] = Math.floor(Registers[5] / 256);
  	}

    if (record(Registers[2]) === false)
      break;
  }

  return {part1Result, part2Result};
}

let {part1Result, part2Result} = main();
console.log(`Part 1 Result: ${part1Result}`);
console.log(`Part 2 Result: ${part2Result}`);
