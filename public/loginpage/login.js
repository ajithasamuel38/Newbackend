
const link = "http://13.49.224.138:3000/user/login";


const errormessage = document.getElementById('error-message');

const login = document.getElementById('loginForm');
login.addEventListener('submit', handlecases);

async function handlecases(event){
    event.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const myObj = {
        email: email,
        password: password
    };
    
    try{
        const response = await axios.post(link, myObj)
       
        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
        console.log(response.data.totalexpense);
        window.location.href = '/expense/expense.html';
       
        
    }catch(err){
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
            errormessage.textContent = err.response.data.message;
        } else {
    
            errormessage.textContent = "An error occurred. Please try again later.";
        }
    }
}

