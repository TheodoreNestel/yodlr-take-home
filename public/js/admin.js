
let element = {}

let valid = {
    all : false,
    email : false,
    fName : false,
    lName : false
}; 

let showForm = true;

let users = {};

let data = {state: "pending"} //we create the object that will contain our new member and add the one value the user has 
//no access to 


const re ={
    email : /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    name : /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u      
}  // our regex for email and name validation 


function $(selector) {
    const e = document.querySelectorAll(selector); // we use selector All to be able to grab all nodes matching our selector.
    return e.length > 1 ? e : e[0] //if there is more than one element matching our selector return the array of nodes.
    //if there is only one node matching our selector destructure it out of the querySelectorAll array and return that. 
}


async function createUser(){ //this will get called when an admin click's submit on their create user form 

    console.log(data , "sent")
    const result = await fetch('http://localhost:3000/users',{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({email:data.email,firstName:data.fName,lastName:data.lName , state:data.state}),
    }).then(res => res.json()) 

    loadUsers();  // we wanna display the newly added user :)

}


async function activateUser(id){ //this method takes an id and then creates a put request to update a user's status 

    const user = users.find(user => user.id == id) //**Arjun */ looks through our array of users for the matching one
    //users being the global value that gets populated with the data received from the back end on init
    
    user["state"] = "active"
    const result = await fetch(`http://localhost:3000/users/${id}`,{
        method : "PUT",
        body : JSON.stringify(user),
        headers : {
            "Content-Type" : "application/json"
        }
    }).then(res => res.json()) 

    displayUsers();
 
}


async function loadUsers(){ //this function makes a call to the back to get all of the user's in our "database"

    users = await fetch('http://localhost:3000/users').then(res => res.json());
    console.log(users)
    displayUsers() // then it calls displayUsers
}

function displayUsers(){ //this methods uses the array of users provided by the back end to display the user's data 
    elements.userUl.innerHTML = "" //clear the Ul out to make sure we dont have dupes 

    users.forEach(user => { //then for each user in our back end 
        elements.userUl.insertAdjacentHTML("beforeEnd" , `

        <li>

        <div>
        <p>Email: ${user.email}</p>
        <p>First Name: ${user.firstName} Last Name: ${user.lastName}</p>
        </div>

        <div>
        ${user.state == "pending" ? `<button data-id="${user.id}">Activate</button>`: "<p>Active</p>"}
        </div>

        </li>

        `) //that way each user Li has its own activate button which has an eventlistener waiting to activate the user 
    })
}


function validateInput(key , regex){ //this function will return another function with the logic needed to validate an input 
    return (function (e) {
        let value = e.target.value //this will use closures to see what the form input's value is which we will then validate 
        data[key] = value; //we then create a key in our data object and we set it to the value we just got 

        if(!value || !regex.test(value) ){ //if the value is empty or if it fails the regex then the input is invalid
           valid[key] = false
        }
        else{
            valid[key] = true
        };

        validate(); // after each input update check to see if all our inputs are valid 
    })
}


function validate(){
      //step 1: we create an array of our valid values
    //step2: filter the array to return only the value that are false which would populate the array
    //step3: we check the length of the array and the convert it to boolean if it has any value that isnt 0 at least one input is not valid
    valid.all = !([valid.email , valid.fName , valid.lName].filter(v => !v).length); 

}






function init(){

    elements = {
        form : $(".AdminCreateUser"),
        email : $("#emailField"),
        fName : $("#firstName"),
        lName : $("#lastName"),
        userUl : $(".users"),
        statusButtons : $("[name=radio]") //here we are selecting both radio buttons using this selector


    } // we grab the elements we will need 


    elements.form.addEventListener("submit" , (e)=>{

        e.preventDefault();
        if(!valid.all){ //if this is false the data is not valid 
            return
        }
        console.log("BeepBoop I submited")
        createUser(); // we post out user to our db 


    })

    loadUsers(); //we need to load/display our users from the db 

    console.log(elements)
     
    //TODO a way to reload users without reloading page when a new user is created by the admin or if their status is updated 


//The logic here uses currying we create a new function inside validateInput which will have access to the event object
//the eventHandler returns. Using closures we have access to three parameters we need and we dont need to repeat code 
//inside the event handler 
    elements.email.addEventListener("change" , validateInput("email", re.email))
    elements.fName.addEventListener("change" , validateInput("fName" , re.name))
    elements.lName.addEventListener("change" , validateInput("lName" , re.name))

 //here we just add the event listener for the admin panel's create a user button 
    $(".adminCreateAccount").addEventListener("click", (e)=>{ //this event listener watched the create User button
        //on the admin panel if its clicked it removes the hidden value from the create user form 

        showForm = !showForm

        elements.form.hidden = showForm;

    })

//if the active radio button is clicked set status to active 
    elements.statusButtons.forEach(element => element.addEventListener("change" , (e) => {
        if(!e.target.checked){
            return
        }
        
        data.state = e.target.value;
    }))


//////////////////////////////////////////////TODO add notes
    elements.userUl.addEventListener("click",(e)=> {
        const target = e.target.closest("button"); 
        if(!target) return 

        activateUser(target.dataset.id);
    })

}


window.addEventListener("load", init())





