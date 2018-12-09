function compare(a, b) {
	var lettersA = a.split("");
	var lettersB = b.split("");
	
	var differences = 0;
	for (var index in lettersA) {
		if (lettersB[index] != lettersA[index])
			differences ++;
	}
	
	return differences;
}

function checkStrings(strings) {
	for (var index in strings) {
		for (var index2 in strings) {
			if (index == index2) continue;
			if (compare(strings[index], strings[index2]) == 1)
				return {
					str1: strings[index],
					str2: strings[index2]
				}
			
		}
	}
	
	return {};
}

var strings = document.body.innerText.trim().split("\n")
var result = checkStrings(strings)
console.log(result.str1)