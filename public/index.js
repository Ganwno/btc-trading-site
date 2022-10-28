'strict user';


const loginButton = document.querySelector("#loginUser");
function main (email, password){
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/login");
    xhttp.onreadystatechange = function(){
        if(this.readyState !== 4) return;
        if(this.status === 200){
            window.open('home.html', '_self');
        }else if(this.status === 403){
            toastr.error(`Error de autenticación: ${403}`)
        }else if(this.status === 401){
            toastr.error(`Error de autenticación: ${401}`)
        }else{
            toastr.error(`Ha ocurrido un error en el servidor: ${this.status}`)
        }
    }
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`email=${email}&password=${password}`);
};



loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    main(email, password)

});