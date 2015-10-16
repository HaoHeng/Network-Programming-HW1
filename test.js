var HOST = process.argv[2] || '127.0.0.1';
var PORT = process.argv[3] || 5566;
var answer = process.argv[4] || 56666;

var S1 = require('dgram').createSocket('udp4');
var S2 =  require('dgram').createSocket('udp4');


//S1 part 
S1.on('listening', function () {
    var address = this.address();
    console.log('S1 listening on ' + address.address + ":" + address.port);
});


S1.bind(PORT, HOST);


