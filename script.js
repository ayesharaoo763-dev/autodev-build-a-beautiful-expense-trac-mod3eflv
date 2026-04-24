let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
let balance = 0;
let income = 0;
let expense = 0;
let chartData = {};

function updateSummary() {
    balance = 0;
    income = 0;
    expense = 0;
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += parseFloat(transaction.amount);
        } else {
            expense += parseFloat(transaction.amount);
        }
        balance = income - expense;
    });
    document.getElementById('balance').innerHTML = `$${balance.toFixed(2)}`;
    document.getElementById('income').innerHTML = `$${income.toFixed(2)}`;
    document.getElementById('expense').innerHTML = `$${expense.toFixed(2)}`;
}

function updateTransactionList() {
    let transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        let transactionHTML = `
            <li>
                <span>${transaction.date}</span>
                <span>${transaction.category}</span>
                <span>$${transaction.amount}</span>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </li>
        `;
        transactionList.insertAdjacentHTML('beforeend', transactionHTML);
    });
}

function updateChart() {
    chartData = {};
    categories.forEach(category => {
        chartData[category] = 0;
    });
    transactions.forEach(transaction => {
        chartData[transaction.category] += parseFloat(transaction.amount);
    });
    let chartCanvas = document.getElementById('chart-canvas').getContext('2d');
    let chart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Category Distribution',
                data: Object.values(chartData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(100, 149, 237, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(100, 149, 237, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function addTransaction(event) {
    event.preventDefault();
    let type = document.getElementById('type').value;
    let category = document.getElementById('category').value;
    let amount = document.getElementById('amount').value;
    let date = document.getElementById('date').value;
    let transaction = {
        type: type,
        category: category,
        amount: amount,
        date: date
    };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateSummary();
    updateTransactionList();
    updateChart();
}

function deleteTransaction(event) {
    if (event.target.classList.contains('delete-btn')) {
        let index = event.target.dataset.index;
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateSummary();
        updateTransactionList();
        updateChart();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateSummary();
    updateTransactionList();
    updateChart();
});

document.getElementById('add-transaction-btn').addEventListener('click', addTransaction);

document.getElementById('transaction-list').addEventListener('click', deleteTransaction);
