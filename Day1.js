var reached = { };
var value = 0;

var args = document.body.innerText.trim().split("\n");
var found = false;
var hasFinished = false;

while (!found) {
	for (var arg of args) {
		value += parseInt(arg);
		
		if (reached[value]) { 
			found = true;
			console.log ("Part 2 result: ", value);
			break;
		}
		reached[value] = true;
	}
	
	if (!hasFinished)
		console.log("Part 1 Result: ", value);
	hasFinished = true;
}
