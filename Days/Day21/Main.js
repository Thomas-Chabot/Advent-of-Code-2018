let DaysCode = "../";
let Modules  = DaysCode + "/../Library/Modules";
let Day19    = DaysCode + "/Day19";

let UI       = require (Day19 + "/Modules/UI.js");
let File     = require (Modules + "/File.js");

let inputFile = "./Input/input.txt";
let outputFile = "./Output/out.txt";

function getResult(ui){
  ui.runOperations();
  return ui.getRegisterValue(2);
}


File.read(inputFile).then((data)=>{
  let index = 0;

  let lastValue = null;
  let values = { };

  let ui = new UI(data, (lineNumber)=>{
    if (lineNumber !== 28) return;
    let value = ui.getRegisterValue(2);

    // Part 1 result is the first one to be detected
    if (lastValue === null)
      console.log(`Part 1 Result: ${value}`);

    // Part 2 result is the first duplicate value
    if (values[value] !== undefined){
      console.log(`Part 2 Result: ${lastValue}`);
      return false;
    }

    if (index > 5) return false;
      index++;

    console.log(`Current value is ${value}, now at the ${index} iteration, last value is ${lastValue}`);

    lastValue = value;
    values[value] = true;
    index++;
  });

  ui.runOperations();
});
