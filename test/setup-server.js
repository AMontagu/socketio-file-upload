/* eslint linebreak-style: ["error", "windows"] */
/* eslint-disable no-console */
/* eslint-env node */

var SocketIo = require("socket.io");
var SiofuServer = require("../server.js");

module.exports = {
	setup: function(httpServer, connectionCb, siofuOptions) {
		var io = new SocketIo(httpServer);
		var uploader = new SiofuServer(siofuOptions);

		io.on("connection", function (socket) {
			uploader.listen(socket);
			connectionCb(socket);
		});

		uploader.dir = "/tmp";

		uploader.uploadValidator = function(event, next) {
			console.log("Passing upload validator for " + event.file.name);
			next(true);
		};

		return uploader;
	},
	listen: function(server, cb) {
		// Try the first time
		var port = Math.floor(Math.random() * 63535 + 2000);
		console.log("Attempting connection on port", port);
		server.listen(port, "127.0.0.1", cb(port));

		server.on("error", function(err){
			// Try again
			port = Math.floor(Math.random() * 63535 + 2000);
			console.log("Attempt failed. Attempting connection on port", port);
			console.log("Error was:", err);
			server.listen(port, "127.0.0.1", cb(port));
		});
	}
};
