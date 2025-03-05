const express = require('express');
const app = express();
const port = 5100;
app.use(express.json());

let userBudget = 0;  // Set user budget to 0
let userExpense = [];  // Array to store user's expenses

// Set your monthly budget
app.post("/userBudget", (req, res) => {
    const { budget } = req.body;
    userBudget = Number(budget);
    res.send(`User budget is ${budget}`);
});

// Add your expense here
app.post("/userExpense", (req, res) => {
    let amount = Number(req.body.amount);  
    const { category, description } = req.body;
    const today = new Date();
    const date = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`;

    if (!amount || !category) {
        return res.send("Amount and Category are required!");  
    }

    userExpense.push({ amount, category, description, date });
    res.send(`User has spent ${amount} on ${category} dated ${date}`);
});

// Get all summary of your expenses
app.get("/summaryExpense", (req, res) => {
    res.send(userExpense);
});

// Check your total expense
app.get("/totalExpense", (req, res) => {
    let total = 0;
    
    for (let i = 0; i < userExpense.length; i++) {
        total += userExpense[i].amount;  
    }

    res.send(`Total spent by user is: ${total}`);
});

// Filter expense from dates
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

    res.status(200).send({ filteredExpense, filteredTotal });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

