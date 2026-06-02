const API = "";

// ======================
// CONTADOR DONACIONES
// ======================

async function actualizarContador() {

    try {

        const res = await fetch(
            `${API}/contador-donaciones`
        );

        const data = await res.json();

        const contador =
            document.getElementById(
                "contadorDonados"
            );

        if (contador) {

            contador.textContent =
                data.total;

        }

    } catch (error) {

        console.log(error);

    }

}

actualizarContador();

// ======================
// FORM DONACIONES
// ======================

const formDonacion =
    document.getElementById(
        "donacionForm"
    );

if (formDonacion) {

    formDonacion.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const datos = {

                nombre:
                    document.querySelector(
                        'input[name="nombre"]'
                    ).value,

                correo:
                    document.querySelector(
                        'input[name="correo"]'
                    ).value,

                equipo:
                    document.querySelector(
                        'input[name="equipo"]'
                    ).value,

                estadoEquipo:
                    document.querySelector(
                        'select[name="estadoEquipo"]'
                    ).value

            };

            const res = await fetch(
                `${API}/donaciones`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(datos)

                }
            );

            const respuesta =
                await res.json();

            alert(respuesta.mensaje);

            formDonacion.reset();

            actualizarContador();

        }
    );

}

// ======================
// SUBIR EXCEL
// ======================

const formExcel =
    document.getElementById(
        "excelForm"
    );

if (formExcel) {

    formExcel.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const archivo =
                document.getElementById(
                    "excel"
                ).files[0];

            const formData =
                new FormData();

            formData.append(
                "excel",
                archivo
            );

            const res = await fetch(
                `${API}/subir-excel`,
                {

                    method: "POST",

                    body: formData

                }
            );

            const data =
                await res.json();

            alert(data.mensaje);

        }
    );

}
// ======================
// SOLICITUDES
// ======================

const solicitudForm =
document.getElementById(
    "solicitudForm"
);

if(solicitudForm){

    solicitudForm.addEventListener(
        "submit",
        async(e)=>{

            e.preventDefault();

            const datos = {

                nombre:
                document.getElementById(
                    "solNombre"
                ).value,

                matricula:
                document.getElementById(
                    "solMatricula"
                ).value,

                carrera:
                document.getElementById(
                    "solCarrera"
                ).value,

                motivo:
                document.getElementById(
                    "solMotivo"
                ).value

            };

            await fetch(
                `${API}/solicitudes`,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify(datos)

                }
            );

            alert(
                "Solicitud enviada"
            );

            solicitudForm.reset();

        }
    );

}

// ======================
// VOLUNTARIOS
// ======================

const voluntarioForm =
document.getElementById(
    "voluntarioForm"
);

if(voluntarioForm){

    voluntarioForm.addEventListener(
        "submit",
        async(e)=>{

            e.preventDefault();

            const datos = {

                nombre:
                document.getElementById(
                    "volNombre"
                ).value,

                correo:
                document.getElementById(
                    "volCorreo"
                ).value,

                area:
                document.getElementById(
                    "volArea"
                ).value

            };

            await fetch(
                `${API}/voluntarios`,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify(datos)

                }
            );

            alert(
                "Voluntario registrado"
            );

            voluntarioForm.reset();

        }
    );

}

// ======================
// CONTACTOS
// ======================

const contactoForm =
document.getElementById(
    "contactoForm"
);

if(contactoForm){

    contactoForm.addEventListener(
        "submit",
        async(e)=>{

            e.preventDefault();

            const datos = {

                nombre:
                document.getElementById(
                    "conNombre"
                ).value,

                correo:
                document.getElementById(
                    "conCorreo"
                ).value,

                mensaje:
                document.getElementById(
                    "conMensaje"
                ).value

            };

            await fetch(
                `${API}/contactos`,
                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify(datos)

                }
            );

            alert(
                "Mensaje enviado"
            );

            contactoForm.reset();

        }
    );

}