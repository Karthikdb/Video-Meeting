const express = require('express')
const http = require('http')
var cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const path = require("path")
var xss = require("xss")

var server = http.createServer(app)
var io = require('socket.io')(server)

app.use(cors())
app.use(bodyParser.json())

app.use(express.static(__dirname+"/build"))
	app.get("/*", (req, res) => {
		res.sendFile(path.join(__dirname+"/build/index.html"))
	})
app.set('port', (process.env.PORT || 4001))

sanitizeString = (str) => {
	return xss(str)
}

connections = {}
messages = {}
timeOnline = {}

io.on('connection', (socket) => {

	socket.on('WELCOME', (path,username) => {
console.log("NEW_GUY_ENTERED")
		if(connections[path] === undefined){
			connections[path] = {}
		}
		connections[path][socket.id]={socketid:socket.id,username:username}

		timeOnline[socket.id] = new Date()
		Object.values(connections[path]).map(connection=>{
			console.log(connection.socketid,socket.id)
if(connection.socketid!==socket.id){
	io.to(connection.socketid).emit("OLDGUYS", socket.id)

	// io.to(connections[path][a].socketid).emit("user-joined", socket.id, connections[path])

}
		})
		

		// if(messages[path] !== undefined){
		// 	for(let a = 0; a < messages[path].length; ++a){
		// 		io.to(socket.id).emit("chat-message", messages[path][a]['data'], 
		// 			messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
		// 	}
		// }

		// console.log(path, connections[path])
	})
socket.on("HEY_NEW_GUY",(NEW_GUY_ID,path)=>{
	console.log("NEW_GUY_ENTERED_ACK_BY"+socket.id)

	io.to(NEW_GUY_ID).emit('user-joined', socket.id, connections[path][NEW_GUY_ID])

})
	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message)
	})

	socket.on('chat-message', (data, sender) => {
		data = sanitizeString(data)
		sender = sanitizeString(sender)

		var key
		var ok = false
		for (const [k, v] of Object.entries(connections)) {
			for(let a = 0; a < v.length; ++a){
				if(v[a].socketid === socket.id){
					key = k
					ok = true
				}
			}
		}

		if(ok === true){
			if(messages[key] === undefined){
				messages[key] = []
			}
			messages[key].push({"sender": sender, "data": data, "socket-id-sender": socket.id})
			// console.log("message", key, ":", sender, data)

			for(let a = 0; a < connections[key].length; ++a){
				io.to(connections[key][a].socketid).emit("chat-message", data, sender, socket.id)
			}
		}
	})

	socket.on('disconnect', () => {
		var diffTime = Math.abs(timeOnline[socket.id] - new Date())
		var key
		for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
			for(let a = 0; a < v.length; ++a){
				if(v[a].socketid === socket.id){
					key = k

					for(let a = 0; a < connections[key].length; ++a){
						// console.log("user-left"+a)
						io.to(connections[key][a].socketid).emit("user-left", socket.id)
					}
			
					var index = connections[key].indexOf(socket.id)
					connections[key].splice(index, 1)

					// console.log(key, socket.id, Math.ceil(diffTime / 1000))

					if(connections[key].length === 0){
						delete connections[key]
					}
				}
			}
		}
	})
})

server.listen(app.get('port'), () => {
	console.log("listening on", app.get('port'))
})