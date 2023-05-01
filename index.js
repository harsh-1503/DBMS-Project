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
    console.log(data);
    console.log(data.rows);
    console.log("Connected Successfully");
    // console.log(req);
    // res.redirect('saveRecipe')
    // console.log(name+" "+email+" "+password)
  } catch (error) {
    console.log("Oracle not connected");
    console.log(error);
    return;
  } 

  try {
    const id =await Math.round(Math.random()*1000);
    const addRecipe = await cons.execute(
      `INSERT INTO foodrecipe
        VALUES (:id,:recipename,:ingredients,:instructions,:prepTime,:cookTime,:servings)`,
      {id ,recipename, ingredients, instructions, cookTime, prepTime, servings }
    );
    await cons.commit();
    console.log("Recipe added Successfully");
    console.log(addRecipe);
    res.redirect('saveRecipe')
    // alert('Recipe Added Successfully')
  } catch (error) {
    console.log("Recipe not added:" + error);
  }
});

app.get('/saveRecipe', async (req, res) => {
  // console.log(result.rows)
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASS,
      connectString: process.env.CONNECT_STRING,
    });

    const result = await  connection.execute('SELECT * FROM foodrecipe ORDER BY id');
    console.log(result)
    
    res.render('recipes', { data: result.rows }); 
  } catch (error) {
    console.log(error)
  }
});


app.delete('/saveRecipe/:id',async (req,res)=>{
  let connect;
  try {
    connect = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASS,
      connectString: process.env.CONNECT_STRING,
    });
    // alert('API CALLED')\       
    console.log(req.params);
    console.log('Hello chutiye');
    const result = await connect.execute(`DELETE  FROM foodrecipe WHERE id='${req.params.id}'`);
    connect.commit();
    console.log(result)
    
    // res.redirect('saveRecipe'); 
  } catch (error) {  
    console.log(error)
  }
})

// const delete = document.
// Set the view engine to EJS
// app.set('view engine', 'ejs');

// Connect to the OracleDB


app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
