import logSymbols from "log-symbols"
import express from "express"
import path from "path"
import fs from "fs"
import Josh from "@joshdb/core";
import provider from "@joshdb/sqlite";

console.log(logSymbols.info, "Starting..")

const app = express()

const db = new Josh({
	name: 'gm_capegroup',
	provider
});

app.use(express.static(path.resolve("src/website")))
app.use("/cosmetics", express.static(path.resolve("src/cosmetics")))

if(!fs.existsSync("./capes")) {
	console.log(logSymbols.warning, "capes folder was not created. creating.")

	fs.mkdirSync("capes")
}


app.get("/users/:user.cfg", async (req, res) => {
	let cosmetics = await db.get(req.params.user);
	
	if(!cosmetics) cosmetics = [];

	const final = {
		items: []
	}

	cosmetics.forEach(cosmetic => {
		final.items.push({
			type: cosmetic,
			model: `cosmetics/${cosmetic}/model.cfg`,
			texture: `cosmetics/${cosmetic}/texture.png`,
			active: true
		})
	})

	res.set('Content-Type', 'application/octet-stream');
	res.send(JSON.stringify(final, null, 2))
})

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