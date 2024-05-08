
const link = "http://13.49.224.138:3000/expense/expensetable";


const form = document.getElementById('expense');
form.addEventListener('submit', addexpense);
const deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach(button => {
    console.log(button);
    button.addEventListener('click', deleteExpense);
});
window.addEventListener("DOMContentLoaded", () => {
   
    let expensesPerPage = localStorage.getItem('expensesPerPage');
    if (!expensesPerPage || expensesPerPage > 5) {
        expensesPerPage = '5'; // Set default to 5
        localStorage.setItem('expensesPerPage', expensesPerPage);
    }
    const page = 1; // You can change this to fetch different pages
    showexpense(page);
});

// Function to handle changing expenses per page
function updateExpensesPerPage() {
    const expensesPerPage = document.getElementById('expensesPerPage').value;
    localStorage.setItem('expensesPerPage', expensesPerPage);
    const currentPage = 1;
    showexpense(currentPage); // Reload expenses for the first page
}

async function addexpense(event){
   event.preventDefault();
   const amount = event.target.amount.value;
   const description = event.target.description.value;
   const category = event.target.category.value;

   const myObj = {
    amount: amount,
    description: description,
    category: category
   }
   try{
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.post(link, myObj, { headers: { "Authorization": token } });
      console.log(response.data.expense);
      displayexpense(response.data.expense);
   }catch(error){
     console.log(error);
   }
}

async function displayexpense(obj){
    const {id, amount, description, category} = obj;
    const expenseList = document.getElementById('expenseList');
    //ul.innerHTML = '';
    const li = document.createElement('li');
    li.innerHTML = `${amount} - ${description} - ${category}`;
    let btn = document.createElement('button');
    btn.id = id;
    btn.type='click';
    btn.textContent = "Delete Expense";
    btn.className ='delete';
    li.appendChild(btn);
    expenseList.appendChild(li);
    btn.addEventListener('click', deleteExpense);
}

async function showexpense(page) {
    const expensesPerPage = localStorage.getItem('expensesPerPage') || 5; // Default to 5 if preference not set
    hidePremiumButton();
    showLeaderBoard();
    const token = localStorage.getItem('token');
    
    console.log("hi");
    try {
        const offset = (page - 1) * expensesPerPage;
        const details = await axios.get(`${link}/expense?page=${page}&limit=${expensesPerPage}&offset=${offset}`, { headers: { "Authorization": token } });
        console.log(details);
        const expenses = details.data.expenses;
        console.log(expenses);
        
        const expenseList = document.getElementById('expenseList');
        expenseList.innerHTML = '';
        console.log(expenseList);

        expenses.forEach(expense => {
            displayexpense(expense)
        });

        const totalExpenses = details.data.totalExpenses;
        //const totalPages = Math.max(1, Math.ceil(totalExpenses / expensesPerPage));
        updatePaginationButtons(details.data.page, details.data.totalPages, totalExpenses);
        

    } catch (err) {
        console.error(err);
    }
}

function updatePaginationButtons(currentPage, totalPages, totalExpenses) {
    const paginationButtons = document.getElementById('paginationButtons');
    paginationButtons.innerHTML = '';

    // Create previous page button if not on the first page
    if (currentPage > 1) {
        const prevButton = createPaginationButton(currentPage - 1);
        paginationButtons.appendChild(prevButton);
    }

    // Create current page button
    const currentPageButton = createPaginationButton(currentPage);
    console.log(currentPage);
    paginationButtons.appendChild(currentPageButton);

    // Create next page button if not on the last page
    if (currentPage < totalPages) {
        const nextButton = createPaginationButton(currentPage + 1);
        paginationButtons.appendChild(nextButton);
    }
}

function createPaginationButton(page) {
    console.log(page);
    const button = document.createElement('button');
    button.textContent = page;
    button.addEventListener('click', () => {
        showexpense(page);
    });
    return button;
}

async function deleteExpense(event){

    const token = localStorage.getItem('token');
    console.log(event)
   
    if(event.target.classList.contains("delete")){
    const parentele = event.target.parentElement;
    const idvalue = event.target.id;
    try{
        const response = await axios.delete(`${link}/${idvalue}`, {headers: {"Authorization" : token}});
        console.log(response);
        parentele.remove();
    }
    catch(err){
        console.log(err);
    }
    

}
}

document.getElementById('rzy_btn').onclick = async function(e){
    try{
        const token = localStorage.getItem('token');

    const response = await axios .get("http://13.49.224.138:3000/purchase/premium", {headers: {"Authorization": token}});

    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response){
            try {

                await axios.post("http://13.49.224.138:3000/purchase/update-premium-status", {

                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } });
                hidePremiumButton();
                
                alert("You are now a premium user!");
                
            } catch (error) {
                console.error("Error processing premium purchase:", error);
                alert("An error occurred while processing the premium purchase. Please try again later.");
            }
        }
    }
    
    const rzpy1 = new Razorpay(options);
    rzpy1.open();
    e.preventDefault();
    rzpy1.on('payment.failed', function(response){
        console.log(response);
        alert("Something went wrong");
    })
    }catch(err){
        console.log(err);
    }
    
}

function hidePremiumButton() {
    const premiumButton = document.getElementById('rzy_btn');
    const token = localStorage.getItem('token');
    const messageElement = document.getElementById('premiumMessage');
    
    if (premiumButton && token) {
        

        axios.get("http://13.49.224.138:3000/purchase/check-premium-status", { headers: { "Authorization": token } })

            .then(response => {
                if (response.data.isPremium) {
                    
                    premiumButton.style.display = 'none';
                    messageElement.innerText = 'You are a premium member now!';
                    showLeaderBoard();
                    messageElement.style.display = 'block';
                } else {
                    
                    premiumButton.style.display = 'block';
                    messageElement.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Error checking premium status:", error);
            });
    }
}

async function showLeaderBoard(){
    const inputElement = document.createElement('input');
    inputElement.type= "button";
    inputElement.value= 'Show LeaderBoard';
    inputElement.onclick = async()=>{
        const token = localStorage.getItem('token');

        const response = await axios.get("http://13.49.224.138:3000/premium/showleaderboard", { headers: { "Authorization": token } });

        console.log(response);
        var leaderboardElem = document.getElementById('leaderboard');
        leaderboardElem.innerHTML = '<h1>Leader Board</h1>';
        response.data.forEach((userDetails) =>{
            leaderboardElem.innerHTML += `<li>Name-${userDetails.name} Total Expense -${userDetails.totalexpense}`;
        })
    }
    document.getElementById('premiumMessage').appendChild(inputElement);
    const viewExpenseBtn = document.createElement('input');
    viewExpenseBtn.type = "button";
    viewExpenseBtn.value = 'DownloadExpense';
    viewExpenseBtn.id = "downloadExpense"
    document.getElementById('premiumMessage').appendChild(viewExpenseBtn);
    viewExpenseBtn.onclick = async () => {
        const token = localStorage.getItem('token');
        download(token);
    }
}

async function download(token){

    await axios.get("http://13.49.224.138:3000/download", { headers: { "Authorization": token } })

    .then((response) =>{
        if((response.status===200)){
          
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = "myexpense.csv";
            a.click();
            previousFiles(token);
            
        }else{
            throw new Error(response.data.message);
            
        }
       
    }).catch((err)=>{
        console.log(err);
        alert(err);
    })
}

async function previousFiles(token){

            await axios.get("http://13.49.224.138:3000/download/fileUrl", { headers: { "Authorization": token } }).then((response)=>{

            console.log(response.data);
            const previousFiles = response.data;
            const fileListElement = document.getElementById('previousDownloads');
            
            fileListElement.innerHTML = '';
            fileListElement.innerHTML += '<h2>Previous Downloads</h2>';
            previousFiles.forEach(file => {
                const listItem = document.createElement('li');
                const downloadLink = document.createElement('a');
                downloadLink.href = file.FileUrl;
                downloadLink.textContent = `File ${file.id}`;
                downloadLink.download = '';
                listItem.appendChild(downloadLink);
                fileListElement.appendChild(listItem);
           })
        }).catch((err) =>{
            console.log(err)
           })
}