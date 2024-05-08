const link = "http://13.49.224.138:3000/user/signup";

const form = document.getElementById('signup');
form.addEventListener('submit', postuserdetails);
const errormessage = document.getElementById('error-message');


async function postuserdetails(event){
    event.preventDefault();
    let name = event.target.name.value;
    let email = event.target.email.value;
    let password = event.target.password.value;
    let postObj = {
        name:name,
        email:email,
        password:password
    };
    errormessage.textContent = '';
    
    try{
        const response = await axios.post(link, postObj);

        clearForm();
       
        console.log(response);
      
    }
    catch(err){
        console.log(err);
        if (err.response && err.response.status === 400 && err.response.data.message === "Email already exists") {
            // Display error message on the UI
            errormessage.textContent = "Email already exists";
        } else {
            errormessage.textContent = "An error occurred. Please try again later.";
        }
    }
    
}

function clearForm() {
    document.getElementById("signup").reset();
  }