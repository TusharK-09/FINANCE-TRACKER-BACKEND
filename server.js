const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = 5100;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Helper function for calculations in templates
hbs.registerHelper('subtract', function(a, b) {
    return a - b;
});

let userBudget = 0;
let userExpense = [];

// Home page route - shows the dashboard
app.get("/", (req, res) => {
    let total = 0;
    for (let i = 0; i < userExpense.length; i++) {
        total += userExpense[i].amount;
    }
    res.render("Home", {
        budget: userBudget,
        expenses: userExpense,
        total: total
    });
});

app.get("/Home", (req, res) => {
    let total = 0;
    for (let i = 0; i < userExpense.length; i++) {
        total += userExpense[i].amount;
    }
    res.render("Home", {
        budget: userBudget,
        expenses: userExpense,
        total: total
    });
});

app.get("/budget" , (req,res)=>{
    res.render("budget");
})
// Set your monthly budget
app.post("/userBudget", (req, res) => {
    const { budget } = req.body;
    userBudget = Number(budget);
    res.redirect("/");
});
//get to form page to add expense
app.get("/expense", (req, res) => {
    res.render("expense"); 
});

// Add your expense here
app.post("/userExpense", (req, res) => {
    let amount = Number(req.body.amount);  
    const { category, description } = req.body;
    const today = new Date();
    const date = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;

    if (!amount || !category) {
        return res.render("error", { message: "Amount and Category are required!" });
    }

    userExpense.push({ amount, category, description, date });
    res.redirect("/");
});

// Summary of expenses
app.get("/summaryExpense", (req, res) => {
    res.render("summary", { userExpense });
    
});

// Total expenses
app.get("/totalExpense", (req, res) => {
    let total = 0;
    for (let i = 0; i < userExpense.length; i++) {
        total += userExpense[i].amount;
    }
    res.render("total", { total });
});

// Filtered expenses
app.get("/filteredExpense", (req, res) => {
    const { startDate, endDate } = req.query;
    let filteredTotal = 0;
    let filteredExpense = [];

    for (let i = 0; i < userExpense.length; i++) {
        let expenseDate = userExpense[i].date;
        if (expenseDate >= startDate && expenseDate <= endDate) {
            filteredExpense.push(userExpense[i]);
            filteredTotal += userExpense[i].amount;
        }
    }

    res.render("filtered", { filteredExpense, filteredTotal });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
