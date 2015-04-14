	var version = '0.1.2';
	//
	//Version 0.1.2
	//Tried to fix saving again
	//
	//Version 0.1.1
	//Tried to fix saving
	//
	//Version 0.1.0
	//Added local saving & loading function
	//Added settings. Command & function to change them will come later.
	//
	//Version 0.0.3
	//Added .pb stop command for managers+
	//
	//Version 0.0.2
	//Disabled the warning, its not really useful
	//Changed the \ in the command to .
	//
	//Version 0.0.1
	//Created first version of PointBot-331
	//
	
	API.sendChat('PointBot-331 v' + version + ' is online! Type .pb help for a list of commands.');
	//API.sendChat('Warning: this bot is still under development; points you get are not final and it doesn\'t have to work 100% correct.')
	
	var users = {
		'5792994' : {
			'points' : 0,
			'username' : 'Zaro38'
		},
		'5010460' : {
			'points' : 0,
			'username' : 'Nuvm'
		}
	}
	
	var settings = {
		'stopRole' : 3,
		'giveRole' : 2,
		'checkOtherRole' : 1,
		'checkRole' : 0
	}
	
	//This function runs when someone says something
	function all(data) {
		var message = data.message;
		var username = data.un;
		var userid = data.uid;
		var messageid = data.cid;
		var userrole = API.getUser(userid).role;
		if (message.slice(0,3) != '.pb') {
			return;
		}
		if (message.split(' ').length < 2) {
			return;
		}
		
		//Check what the message is, and if it's an existing PointBot command, respond
		switch (message.split(' ')[1]) {
			case 'commands':
				API.sendChat('[PB] [@' + username + '] Click here for a list of commands: https://github.com/DragonCzz/PointBot-331/blob/master/commands.md');
				break;
			case 'stop':
				if (userrole >= settings.stopRole) {
					API.sendChat('[PB] [@' + username + '] Stopping PointBot-331!');
					API.off(API.CHAT,all);
				}
				break;
			case 'points':
				//if the command is ran by [set rank] or higher and someone is @mentioned in it
				if (userrole >= settings.checkOtherRole && message.split('@').length > 1) {
					//respond
					var userTargetName = message.slice(message.indexOf('@') + 1,255);
					API.sendChat('[PB] [@' + username + '] The user @' + userTargetName + ' has ' + checkPoints(userTargetName) + ' points.')
				}
				else {
					if (userrole >= settings.checkRole) {
						//respond
						API.sendChat('[PB] [@' + username + '] You have ' + checkPoints(username) + ' points.')	
					}
				}
				break;
			case 'give':
				break;
		}
	}
	
	function checkPoints(username) {
		var userid;
		var i = 0;
		//get the ID of the target user and assign it to userTargetId
		while (i < API.getUsers().length) {
			if(API.getUsers()[i].username == username) {
				userid = API.getUsers()[i].id;
				i = API.getUsers().length;
			}
			i++;
		}
		//if the person specified is not yet in the user list
		if (users[userid] == undefined) {
			users[userid] = {'points':0,'username':username};
		}
		//get the points of the user
		var targetUserPoints = users[userid].points;
		return targetUserPoints;
	}
	
	function saveStuff() {
		localStorage.PBUsers = JSON.stringify(users);
		localStorage.PBSettings = JSON.stringify(settings);
	}
	
	function loadStuff() {
		users = JSON.parse(localStorage.PBusers);
		settings = JSON.parse(localStorage.PBSettings);
	}
	
	//Let the function "all" run when there is a new message
	API.on(API.CHAT,all);
