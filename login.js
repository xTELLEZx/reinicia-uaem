const form =
document.getElementById(
    "loginForm"
);

form.addEventListener(
    "submit",
    (e)=>{

        e.preventDefault();

        const usuario =
        document.getElementById(
            "usuario"
        ).value;

        const password =
        document.getElementById(
            "password"
        ).value;

        // ======================
        // LOGIN SIMPLE
        // ======================

        if(
            usuario === "admin"
            &&
            password === "100823"
        ){

            localStorage.setItem(
                "adminLogeado",
                "true"
            );

            window.location.href =
            "admin.html";

        }else{

            alert(
                "Datos incorrectos"
            );

        }

    }
);