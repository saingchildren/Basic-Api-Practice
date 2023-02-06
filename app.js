const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/newDB");

const schema = new mongoose.Schema({
	id: String,
	name: String,
	age: Number,
	skill: [String],
	graduationThreshold: {
		service: Boolean,
		english: Boolean,
		information: Boolean,
	},
	gQualification: Boolean,
});

const Student = mongoose.model("Student", schema);

app.get("/", (req, res) => {
	res.send("this is homepage");
});

//get all student data
app.get("/students", async (req, res) => {
	await Student.find({})
		.then((data) => {
			res.send(data);
		})
		.catch((e) => {
			res.send(e);
		});
});

//add new student data
app.post("/students", (req, res) => {
	const { id, name, age, skill, service, english, information } = req.body;
	const qQualification = null;

	if (service && english && information) {
		gQualification = true;
	} else {
		gQualification = false;
	}

	const student = new Student({
		id: id,
		name: name,
		age: age,
		skill: skill,
		graduationThreshold: {
			service: service,
			english: english,
			information: information,
		},
		gQualification: gQualification,
	});

	student
		.save()
		.then((data) => {
			res.send(data);
		})
		.catch((e) => {
			res.send(e);
		});
});

//delete student data
app.delete("/students/:id", (req, res) => {
	const { id } = req.params;
	console.log(id);
	try {
		Student.deleteOne({ id }).then((msg) => {
			res.send(msg);
		});
	} catch (e) {
		res.send(e);
	}
});

class newData {
	constructor() {}
	setData(key, value) {
		if (key !== "service" && key !== "english" && key !== "information") {
			this[key] = value;
		} else {
			this[`graduationThreshold.${key}`] = value;
		}
	}
}

//update data use patch method
app.patch("/students/:id", async (req, res) => {
	const { id } = req.params;

	const newItem = new newData();

	for (let i in req.body) {
		newItem.setData(i, req.body[i]);
	}

	Student.findOneAndUpdate({ id: id }, newItem, {
		new: true,
		runValidators: true,
	})
		.then((msg) => {
			res.send("Success update")
		})
		.catch((e) => {
			console.log(e);
		});
});

app.listen(3030, () => {
	console.log("server runnning in 3030");
});
