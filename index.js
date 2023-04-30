const express = require("express");
const app = express();
const oracledb = require("oracledb");
require("dotenv").config();
// const {connectoracle} = require('./db')
// connectoracle();
// const {cons} = require('./db')
const port = process.env.PORT || 5000;

const path = require("path");
const template_path = path.join(__dirname, "./template/views");
console.log(__dirname);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", template_path);

app.get("/", (req, res) => {
  res.render("index");
});
// app.get("/saveRecipe",(req,res)=>{
//   res.render("recipes") 
// })
app.post("/saveRecipe", async (req, res) => {
  let cons;
  const {
    recipename,
    instructions,
    ingredients,
    cookTime,
    prepTime,
    servings,
  } = req.body;
  try {
    cons = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASS,
      connectString: process.env.CONNECT_STRING,
    });

    const data = await cons.execute(`SELECT * FROM foodrecipe`);

    console.log(data.rows);
    console.log("Connected Successfully");
    // console.log(req);
    res.redirect('saveRecipe')
    // console.log(name+" "+email+" "+password)
  } catch (error) {
    console.log("Oracle not connected");
    console.log(error);
    return;
  }

  try {
    const addRecipe = await cons.execute(
      `INSERT INTO foodrecipe
        VALUES (:recipename,:ingredients,:instructions,:prepTime,:cookTime,:servings)`,
      { recipename, ingredients, instructions, cookTime, prepTime, servings }
    );
    await cons.commit();
    console.log("Recipe added Successfully");
    console.log(addRecipe);
    // alert('Recipe Added Successfully')
  } catch (error) {
    console.log("Recipe not added:" + error);
  }
});



// Set the view engine to EJS
// app.set('view engine', 'ejs');

// Connect to the OracleDB
oracledb.getConnection(
  {
    user: process.env.USER,
    password: process.env.PASS,
    connectString: process.env.CONNECT_STRING,
  },
  (err, connection) => {
    if (err) {
      console.error(err.message);
      return;
    }


    const sql = `SELECT * FROM foodrecipe`;


    connection.execute(sql, [], (err, result) => {
      if (err) {
        console.error(err.message);
        return;
      }


      connection.release();

      app.get('/saveRecipe', (req, res) => {
        // console.log(result.rows)
        res.render('recipes', { data: result.rows });
      });
    });
  }
);


app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
