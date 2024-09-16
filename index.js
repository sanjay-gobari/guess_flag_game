import bodyParser from "body-parser";
import express from "express"
import pg from "pg"

const app = express();
const port = 3000;
let quiz = []
let current_quiz=null
let score =0
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "Sanjay@#",
    port: 5432
})
db.connect();
db.query("SELECT * FROM flags", (err, result) => {
    if (!err) {
        quiz = result.rows
    }
    else {
        console.log("error in db", err)
    }
})
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function genques(){
    current_quiz = quiz[getRandomNumber(0,quiz.length-1)]
    console.log(current_quiz)
}

app.get("/", (req, res) => {
    genques()
    res.render("index.ejs", { data: {flag:current_quiz.flag,score} })

})
app.get("/retry", (req, res) => {
    score=0;
    res.redirect("/")

})

app.post("/submit", (req, res) => {
    const udata = req.body;
    console.log(udata)
    if(udata.flag_name!='')
    {
        if(current_quiz.name.toLowerCase() == udata.flag_name.trim().toLowerCase()){
            console.log("correct")
            score +=1;
            res.redirect("/")
        }
        else{
            res.render("index.ejs", { data:{flag:null,score}})
        }
    }
    else{
        res.redirect("/")
    }

})

app.listen(port, () => { console.log(`server running at http://localhost:${port}`) })