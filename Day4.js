const CommandTypes = {
	WakeUp: "wakes up",
	Sleep: "falls asleep",
	StartsShift: "starts shift"
}

function getHighest(array, getter) {
	if (!getter) getter = (value)=>value;

	var highestValue = 0;
	var highestIndex = 0;
	for (var index in array) {
		var value = getter (array[index]);
		if (value > highestValue) {
			highestValue = value;
			highestIndex = index;
		}
	};
	return {index: highestIndex, value: array[highestIndex]};
}

class Minutes {
	constructor(){
		this._minutes = [ ];
		this._started = null;
	}
	
	get total(){
		var total = 0;
		this._each((_, tm) => total += tm);
		return total;
	}
	get biggestMinute(){
		return getHighest(this._minutes).index;
	}
	
	start(minute){
		this._started = minute;
	}
	stop(minute) {
		for (var dur = this._started; dur < minute; dur++)
			this._increment(dur);
	}
	valueOf(minute){ return this._minutes[minute]; }
	
	_increment(minute){
		if (!this._minutes [minute])
			this._minutes [minute] = 0;
		this._minutes [minute] ++;
	}
	_each(f){
		for (var index in this._minutes)
			f(index, this._minutes[index]);
	}
}

class Guard {
	constructor(id){
		this._id = id;
		this._minutes = new Minutes();
		
		console.log(`Made new guard: #${id}`);
	}
	
	get id(){ return this._id; }
	get minutesAsleep(){ return this._minutes.total; }
	get mostLikelySleepTime(){ return this._minutes.biggestMinute; }
	timeAsleepAt(minute){ return this._minutes.valueOf (minute); }
	
	sleep(minute){
		console.log(`Guard #${this.id} sleeping at 00:${minute}`);
		this._minutes.start(minute);
	}
	
	wakeUp(minute){
		console.log(`Guard #${this.id} waking up at 00:${minute}`);
		this._minutes.stop(minute);
	}
}

class Guards {
	constructor(){
		this._currentGuard = null;
		this._guards = { };
	}
	
	get sleepiestGuard(){
		return getHighest(this._guards, (guard)=>guard.minutesAsleep).value;
	}
	get mostFrequentlyAsleep(){
		return getHighest(this._guards, (guard)=>guard.timeAsleepAt(guard.mostLikelySleepTime)).value;
	}
	
	startShift(guardNumber) {
		this._currentGuard = this._getGuard(guardNumber);
	}
	sleep(...args){ this._currentGuard.sleep(...args); }
	wakeUp(...args){ this._currentGuard.wakeUp(...args); }
	
	_getGuard(guardNumber){
		if (!this._guards [guardNumber])
			this._guards [guardNumber] = new Guard(guardNumber);
		return this._guards [guardNumber];
	}
}

class Command {
	constructor(commandType, time, ...args){
		this._type = commandType;
		this._time = new Date(time);
		this._args = args;
	}
	
	get type(){ return this._type; }
	get minute(){ return this._time.getMinutes(); }
	get date(){ return this._time; }
	
	get args(){ return this._args; }
	
	compareTo(otherCommand){
		return this.date - otherCommand.date;
	}
	toString(){
		return `[${this.date.toLocaleDateString()} 00:${this.minute}] ${this.type}`;
	}
}

class UIBase {
	/* Constructor */
	constructor(text){
		let lines = text.trim().split("\n");
		this._data = this._construct(lines);
	}
	
	/* Public Methods */
	run(){
		this._each((d)=>this._run(d));
	}
	
	/* Private Methods */
	// construct the object from the UI
	_construct(lines){
		let result = [ ];
		for (var i = 0; i < lines.length; i++) {
			result.push(this._parse(lines[i]));
		}
		return result;
	}
	
	/* Helper Methods */
	_each(f){
		for (var data of this._data)
			f(data);
	}
	_sort(comparator){
		console.log("sorting")
		this._data.sort(comparator);
	}
	
	/* Must Overload */
	_run(data){
		throw new Error("_run method must be overloaded");
	}
	_parse(line){
		throw new Error("_parse method must be overloaded");
	}
}

class UI extends UIBase {
	/* Constructor */
	constructor(text){
		super(text);
		this._guards = new Guards();
		
		this._sort((cmd1, cmd2) => cmd1.compareTo(cmd2));
	}
	
	/* Getters */
	get part1Result(){
		let sleepiestGuard = this._guards.sleepiestGuard;
		return this._valueFor (sleepiestGuard);
	}
	get part2Result(){
		let sleepiestGuard = this._guards.mostFrequentlyAsleep;
		return this._valueFor (sleepiestGuard);
	}
	
	/* Public Methods */
	run(){
		super.run();
	}
	
	/* Private Methods */
	// Running
	_run(command){
		console.log (command.toString())
		switch (command.type) {
			case CommandTypes.WakeUp:
				this._guards.wakeUp(command.minute);
				break;
			case CommandTypes.Sleep:
				this._guards.sleep(command.minute);
				break;
			case CommandTypes.StartsShift:
				this._guards.startShift(command.args[0]);
				break;
		}
		
	}
	
	// Data Parsing
	_parse(line){
		let [str, date, command] = line.match(/\[([^\]]+)] (.*)/);
		switch(command) {
			case "wakes up":
				return new Command(CommandTypes.WakeUp, date);
			case "falls asleep":
				return new Command(CommandTypes.Sleep, date);
			default:
				let guardNumber = this._parseGuardNumber(command);
				return new Command(CommandTypes.StartsShift, date, guardNumber);
		}
	}
	_parseGuardNumber(line){
		let [str, guardNumber] = line.match(/Guard #([0-9]+) begins shift/);
		return parseInt(guardNumber);
	}
	
	// Results
	_valueFor(guard) {
		let sleepiestMinute = guard.mostLikelySleepTime;
		let guardId = guard.id;
		
		return guardId * sleepiestMinute;
	}
}

var text = document.body.innerText;
var ui = new UI(text);
ui.run()

console.log(`Part 1 Result: ${ui.part1Result}`);
console.log(`Part 2 Result: ${ui.part2Result}`);
