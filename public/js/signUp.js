let elements = {}

let valid = { //this object of booleans is how we will validate all our inputs 
    all : false,
    email : false,
    fName : false,
    lName : false
}; 

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



function validate(){
    //step 1: we create an array of our valid values expects valid.all since we will be setting its value here 
    //step2: filter the array to return only the value that are false which would populate the array
    //step3: we check the length of the array and the convert it to boolean if it has any value that isnt 0 at least one input is not valid
    valid.all = !([valid.email , valid.fName , valid.lName].filter(v => !v).length); 


}


function validateInput(key , regex){ //this function will return another function with the logic needed to validate an input 
    //this uses a technic known as currying :) where a function returns a function 
    return (function (e) {
        let value = e.target.value //this will use closures  to see(we can see the event) what the form input's value is 

        data[key] = value; //we then create a key in our data object and we set it to the value we just got ^ 

        if(!value || !regex.test(value) ){ //if the value is empty or if it fails the regex then we set our valid object's key to false
           valid[key] = false
        }
        else{ //if its passes the regex we then set our valid object's key to true 
            valid[key] = true
        };

        validate(); // after each input update check to see if all our inputs are valid 
    })
}





async function postUser(){ //this function creates a post request using the js fetch api (first time using it over Axios)

    const result = await fetch('/users',{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({email:data.email,firstName:data.fName,lastName:data.lName})
    }).then(res => res.json()) 

    window.location.href = `/homepage.html?fName=${data.fName}&lName=${data.lName}`

}

function initPage(){ //this function is out init function which will load all out other event listeners when the page loads 
    elements = { //here we grab our form's inputs and place them in an objects 
        form : $("form"),
        email : $("#emailField"),
        fName : $("#firstName"),
        lName : $("#lastName")
    }

    elements.form.addEventListener("submit", (e)=>{ //this runs when the form submits
        e.preventDefault() // prevents the page from reloading 
        if(!valid.all){ //if this is false the data is not valid 
            return
        }
        postUser(); // we post out user to our db 
    })


//we set the event listeners on all our form inputs and listen for changes

//when change is detected validateInput is called which will take the type of input that was changed and the regex needed to validate
//that input. It will then return a function (currying) which using closures has access to the event object. 
//this returned function will then save what is currently in the input and check to see if that input is valid 

    elements.email.addEventListener("change" , validateInput("email", re.email))
    elements.fName.addEventListener("change" , validateInput("fName" , re.name))
    elements.lName.addEventListener("change" , validateInput("lName" , re.name))
    
   
}

window.addEventListener("load" , initPage()) //calls our init function to set up the page and event listeners 