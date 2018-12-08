function getCheckSum(terms) {
	var counts = [0, 0, 0];
	for (var term of terms) {
		var {has2, has3} = check(term);
		if (has2)
			counts[1] ++;
		if (has3)
			counts[2] ++;
	}
	
	return counts[1] * counts[2];
}
function check (box) {
	var counts = count(box);
	return checksums(counts);
}
function count(word) {
	var counts = { };
	for (var letter of word) {
		if (!counts[letter])
			counts[letter] = 0;
		counts [letter] ++;
	}
	return counts;
}
function checksums(counts) {
	var has2 = false;
	var has3 = false;
	
	for (var count in counts) {
		if (counts[count] == 2)
			has2 = true;
		else if (counts[count] == 3)
			has3 = true;
	}
	
	return {has2, has3};
}

check("ababa");


var terms = document.body.innerText.split("\n")
getCheckSum(terms);