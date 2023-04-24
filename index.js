const express = require('express')
const app = express();
const oracledb = require('oracledb')
require('dotenv').config();
// const {connectoracle} = require('./db')
// connectoracle();
// const {cons} = require('./db')
const port = process.env.PORT || 5000

const path = require('path')
const template_path = path.join(__dirname, "./template/views");
console.log(__dirname);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", template_path);


app.get('/',(req,res)=>{
    res.render("index")
})

app.post('/saveRecipe',async(req,res)=>{
    let cons;
    const {recipename,instructions,ingredients,cookTime,prepTime,servings} = req.body;
    try {
        cons = await oracledb.getConnection({     
            user:process.env.USER,
            password:process.env.PASS,  
            connectString: process.env.CONNECT_STRING,
        });

        const data = await cons.execute(
            `SELECT * FROM foodrecipe`
        )

        console.log(data.rows);
        console.log('Connected Successfully');
        // console.log(req);
        

        // console.log(name+" "+email+" "+password)
          
    } catch (error) {
        console.log('Oracle not connected');
        console.log(error);
        return
    }

    try {
        const addRecipe = await cons.execute(`INSERT INTO foodrecipe
        VALUES (:recipename,:ingredients,:instructions,:prepTime,:cookTime,:servings)`,{recipename,ingredients,instructions,cookTime,prepTime,servings})
        await cons.commit();
        console.log('Recipe added Successfully');
        console.log(addRecipe);
    } catch (error) {
        console.log("Recipe not added:" + error);
    }
    

})




app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`);
})





