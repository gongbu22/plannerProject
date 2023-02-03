const express = require('express')
const bodyParser = require('body-parser')
const CircularJSON = require('circular-json')
const request = require('request')
const mysql = require("sync-mysql")
const env =require("dotenv").config({ path:"../../.env"});

var connection = new mysql({
		host : process.env.host,
		user : process.env.user,
		password : process.env.password,
		database : process.env.database
});

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

let urls ="";

app.get("/Hello", (req, res)=> {
 const result = connection.query("SELECT * FROM plan");
    if (result) {
       console.log("DB connected");
       res.send("DB connected");
    }
    
})


// insert data into plan table  하는중
app.post("/plan/regist", (req,res) => {
  const { planDate, planTitle, planContents } = req.body
  const select2 = connection.query("SELECT * FROM plan where plan_title='"+planTitle+"' and plan_date='"+planDate+"'");
      
      // var temp = select2[0]['plan_title'];
      // console.log(temp);
      //res.send(JSON.stringify({ ok: true, plans: select2}));
if( select2[0]==null ) {
   //console.log("success");
      const result = connection.query(
      "INSERT INTO plan values(?, ?, ?, ?)", [
          null,
          planDate,
          planTitle,
          planContents
      ]);
       console.log(JSON.stringify({ ok: true, plans: result}));
      
      //console.log(JSON.stringify({ ok: true, plan: {seq: seq, plan_date: planDate, plan_title: planTitle, plan_contents: planContents}}));
      res.send(
        `<script>
          alert("등록되었습니다.");
        </script>
          
       `);
}else {
   console.log('fail');
      res.send(
      `<script>
          alert("이미등록되었습니다.");
        </script>
          
       `);
 }
 
});


//list 하는중-post
app.post("/list", (req, res) => {
 const result = connection.query("SELECT * FROM plan");
 
//res.send(JSON.parse(JSON.stringify({ ok: true, plans: result})));

 var plans = result;
 console.log(plans[0]['plan_contents']);
 
 //res.writeHead(200);
  var template = `
  <!doctype html>
  <html>
  <head>
    <title>result</title>
    <meta charset="utf-8">
   
  </head>
  <body>
   <table border="1" margin:auto; text-align:center;>
     <tr>
       <th>seq</th>
       <th>plan_date</th>
       <th>plan_title</th>
       <th>plan_contents</th>
       <th>update</th>
       <th>delete</th>
     </tr>
   `;
   for(var i=0; i<plans.length; i++) {
    template += `
     <tr>
     <form method="post" action="/update" id="formname">
       <th><input type="int" style="width:30px; text-align:center" value=${plans[i]['seq']} name="seq"></input></th>
       <th><input type="text" style="width:200px; text-align:center" value=${plans[i]['plan_date'].slice(0,10)} name="planDate"></input></th>
       <th><input type="text" style="width:100px; text-align:center" value=${plans[i]['plan_title']} name="planTitle"></input></th>
       <th><input type="text" style="width:200px; text-align:center" value=${plans[i]['plan_contents']} name="planContents"></input></th>
      
       <th><button type="submit" name='planUpdate' value=${plans[i].seq} fromaction="/update">수정</button></th>
     </form>
     <form method="post">
       <th><button type="submit" name='planDelete' value=${plans[i].seq} formaction="/delete">삭제</button></th>
     </form>
     </tr>
    `
   
   
   }
   

   template += `
     </table>
     
  </body>
  </html>
 `;
 res.send(template);

});



// delete from plan
     app.post("/delete", (req, res) => {
      const {planDelete} = req.body;
      //console.log(req.body['planDelete']);
      const result = planDelete
      //res.send(JSON.stringify({ ok: true, plans: result}));
      const plans = result
      console.log(plans);
      
      const dresult = connection.query("DELETE FROM plan where seq='"+plans+"'");
      console.log(dresult);
     
      
      res.send(plans+"번 삭제되었습니다.");
      
      
          
          });
  
 
  //update
  app.post("/update", (req, res) => {
    //console.log(req.body);
    const {planUpdate, planTitle, planContents } = req.body;
   
   res.send(JSON.stringify({ ok: true, plans: planUpdate}));
   const plans = planUpdate;
   
    const uresult = connection.query(
     "update plan set plan_title=?, plan_contents=? where seq=?", [
      planTitle,
      planContents,
      plans
     ]);
    console.log(uresult);
   
    res.send("수정되었습니다.");
    //console.log(JSON.stringify({ ok: true, plan: {seq: req.body['seq'], plan_date: req.body['plan_date'], plan_title: req.body['plan_title'], plan_contents: req.body['plan_contents'] }}));
  });
  
 
 
module.exports = app;
