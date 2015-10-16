const client_host = '127.0.0.1';
const client_port = 16017;
const server_host = process.argv[2] || '127.0.0.1' // server ip can be specified using third argument. default value is 127.0.0.1
const server_port = process.argv[3] || 5566

// node udp_client.js 140.113.235.151 11
//0: node
//1: udp_client.js
//2: '140.113.235.151'
//3: 11

var client = require('dgram').createSocket('udp4') ;

// client part
client.bind(client_port, client_host);

client.on('listening', function(){
	var address = this.address() ;
	console.log('UDP client listening on ' + address.address + ":" + address.port) ;
	
	new_guess = JSON.stringify({"guess" : 30000});
	console.log("send "+new_guess);
	client.send(new_guess, 0, new_guess.length, server_port, server_host, function(err) {
		if (err) throw err;
	});	
}
);

var last_guess=30000 ;
var lower_bound=3000  ;
var upper_bound=60001 ; // because of "parseInt" function, which discard the fraction part of a number, it is an open interval at upper bound
// possible value: [ 3000 , 60001 ), i.e. [ 3000 , 60000 ]

// if upper_bound is set to 60000 and the correct value is also 60000, then
// last guess = 59999, new guess = parseInt( (upper_bound+lower_bound)/2 ) = parseInt( (59999+60000)/2 ) = 59999, the same as last guess, result in infinite loop.

const result_larger_json = JSON.stringify({"result":"larger"}) ;
const result_smaller_json = JSON.stringify({"result":"smaller"}) ;
const result_bingo_json = JSON.stringify({"result":"bingo!"}) ;
const result_congrats_json = JSON.stringify({"result":"Congrats! 0116017"}) ;

client.on('message', function (message, remote) {
	
	console.log('receive '+message) ;
	
	if(message==result_larger_json){
		
		lower_bound = last_guess ;
		new_guess = JSON.stringify({ "guess" : parseInt((upper_bound+lower_bound)/2) }) ;
		last_guess = parseInt( (upper_bound+lower_bound)/2 ) ;
		
		console.log("send "+new_guess);
		client.send(new_guess, 0, new_guess.length, remote.port, remote.address, function(err) {
			if (err) throw err;
		});	
		
	}
	else if(message==result_smaller_json){
		
		upper_bound = last_guess ;
		new_guess = JSON.stringify({ "guess" : parseInt((upper_bound+lower_bound)/2) }) ;
		last_guess = parseInt( (upper_bound+lower_bound)/2) ;
		
		console.log("send "+new_guess);
		client.send(new_guess, 0, new_guess.length, remote.port, remote.address, function(err) {
			if (err) throw err;
		});	
		
	}
	else if(message==result_bingo_json){
		
		studentID_json = JSON.stringify({ "student_id" : "0116017" }) ;
		console.log("send "+studentID_json);
		client.send(studentID_json, 0, studentID_json.length, last_guess, remote.address, function(err) {
			if (err) throw err;
		});	
		
	}
	else if(message==result_congrats_json){
		
		this.close() ;
	}
	
	
	
});


// print argument out : http://stackoverflow.com/questions/4351521/how-to-pass-command-line-arguments-to-node-js
// minimum client-server example : http://www.hacksparrow.com/node-js-udp-server-and-client-example.html
// node js udp doc : https://nodejs.org/api/dgram.html


