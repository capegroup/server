import logSymbols from "log-symbols"
import express from "express"
import path from "path"
import fs from "fs"

console.log(logSymbols.info, "Starting..")

const app = express()
app.use(express.static(path.resolve("src/website")))

if(!fs.existsSync("./capes")) {
	console.log(logSymbols.warning, "capes folder was not created. creating.")
	fs.mkdirSync("capes")
}

app.get('/capes/:username.png', (req, res) => {
	const username = req.params.username;
	
	if(fs.existsSync(`./capes/${username}.png`)) {
		console.log(logSymbols.info, "Sending a CG cape to " + username + "!")
		
		return res.sendFile(path.resolve(`capes/${username}.png`))
	} else {
		console.log(logSymbols.info, "Sending a Optifine cape to " + username + "!")
		
		return res.redirect(`http://107.182.233.85/capes/${username}.png`);
	}
})

app.listen(20005, () => {
	console.log(logSymbols.success, "Started on port 20005!")
})