// ======================
// PROTEGER ADMIN
// ======================

const acceso =
localStorage.getItem(
    "adminLogeado"
);

if(acceso !== "true"){

    window.location.href =
    "login.html";

}

const API = "";

// ======================
// CARGAR DATOS
// ======================

async function cargarDatos(){

    const res =
    await fetch(
        `${API}/sqlite`
    );

    const data =
    await res.json();

    // ======================
    // DONACIONES
    // ======================

    const donaciones =
    document.getElementById(
        "donacionesContainer"
    );

    donaciones.innerHTML = "";

data.donaciones.forEach(
    item => {

        donaciones.innerHTML += `
        
<div class="donacion">

    <div class="top-donacion">

        <div>

            <h3>
                ${item.nombre}
                donó un equipo
            </h3>

            <p>
                Correo:
                ${item.correo}
            </p>

            <p>
                Equipo:
                ${item.equipo}
            </p>

            <p>
                Estado:
                ${item.estadoEquipo}
            </p>

        </div>

        <div class="acciones">

            <span class="badge">

                ${item.estado || "pendiente"}

            </span>

            <button
                class="btn-ok"
                onclick="
                actualizarEstado(
                    'donaciones',
                    ${item.id},
                    'aprobado'
                )
                "
            >
                ✔
            </button>

            <button
                class="btn-bad"
                onclick="
                actualizarEstado(
                    'donaciones',
                    ${item.id},
                    'rechazado'
                )
                "
            >
                ✖
            </button>

        </div>

    </div>

</div>
`;

    }
);
    // ======================
    // SOLICITUDES
    // ======================

    const solicitudes =
    document.getElementById(
        "solicitudesContainer"
    );

    solicitudes.innerHTML = "";

    data.solicitudes.forEach(
    item => {

        solicitudes.innerHTML += `
        
<div class="donacion">

    <div class="top-donacion">

        <div>

            <h3>
                ${item.nombre}
                solicita un equipo
            </h3>

            <p>
                Matrícula:
                ${item.matricula}
            </p>

            <p>
                Carrera:
                ${item.carrera}
            </p>

            <p>
                Motivo:
                ${item.motivo}
            </p>

        </div>

        <div class="acciones">

            <span class="badge">

                ${item.estado || "pendiente"}

            </span>

            <button
                class="btn-ok"
                onclick="
                actualizarEstado(
                    'solicitudes',
                    ${item.id},
                    'aprobado'
                )
                "
            >
                ✔
            </button>

            <button
                class="btn-bad"
                onclick="
                actualizarEstado(
                    'solicitudes',
                    ${item.id},
                    'rechazado'
                )
                "
            >
                ✖
            </button>

        </div>

    </div>

</div>
`;

    }
);

    // ======================
    // VOLUNTARIOS
    // ======================

    const voluntarios =
    document.getElementById(
        "voluntariosContainer"
    );

    voluntarios.innerHTML = "";

    data.voluntarios.forEach(
        item => {

            voluntarios.innerHTML += `
            
<div class="donacion">

    <div class="top-donacion">

        <div>

            <h3>
                ${item.nombre}
                quiere ser voluntario
            </h3>

            <p>
                Correo:
                ${item.correo}
            </p>

            <p>
                Área:
                ${item.area}
            </p>

        </div>

        <div class="acciones">

            <span class="badge">

                ${item.estado || "pendiente"}

            </span>

            <button
                class="btn-ok"
                onclick="
                actualizarEstado(
                    'voluntarios',
                    ${item.id},
                    'aprobado'
                )
                "
            >
                ✔
            </button>

            <button
                class="btn-bad"
                onclick="
                actualizarEstado(
                    'voluntarios',
                    ${item.id},
                    'rechazado'
                )
                "
            >
                ✖
            </button>

        </div>

    </div>

</div>
`;

        }
    );

    // ======================
    // CONTACTOS
    // ======================

    const contactos =
    document.getElementById(
        "contactosContainer"
    );

    contactos.innerHTML = "";

    data.contactos.forEach(
        item => {

            contactos.innerHTML += `
            
            <div class="donacion">

                <h3>
                    ${item.nombre}
                </h3>

                <p>
                    Correo:
                    ${item.correo}
                </p>

                <p>
                    Mensaje:
                    ${item.mensaje}
                </p>

            </div>

            `;

        }
    );

    // ======================
    // INVENTARIO
    // ======================

    const tabla =
    document.getElementById(
        "tablaInventario"
    );

    tabla.innerHTML = "";

    data.inventario.forEach(
        item => {

            tabla.innerHTML += `
            
            <tr>

    <td>${item.id}</td>

    <td>${item.nombre}</td>

    <td>${item.modelo}</td>

    <td>${item.serie}</td>

 <td>

    <button
        class="btn-edit"
        onclick="
        editarInventario(
            ${item.id},
            '${item.nombre}',
            '${item.modelo}',
            '${item.serie}'
        )
        "
    >
        ✏️
    </button>

    <button
        class="btn-delete"
        onclick="
        eliminarInventario(
            ${item.id}
        )
        "
    >
        🗑
    </button>

</td>
</tr>

            `;

        }
    );

}

cargarDatos();

setInterval(
    cargarDatos,
    3000
);

// ======================
// ELIMINAR INVENTARIO
// ======================

document.getElementById(
    "eliminarInventario"
).addEventListener(
    "click",
    async()=>{

        await fetch(
            `${API}/inventario`,
            {

                method:"DELETE"

            }
        );

        cargarDatos();

    }
);

// ======================
// AGREGAR INVENTARIO
// ======================

document.getElementById(
    "agregarInventarioForm"
).addEventListener(
    "submit",
    async(e)=>{

        e.preventDefault();

        const datos = {

            nombre:
            document.getElementById(
                "nombre"
            ).value,

            modelo:
            document.getElementById(
                "modelo"
            ).value,

            serie:
            document.getElementById(
                "serie"
            ).value

        };

        await fetch(
            `${API}/inventario`,
            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify(
                    datos
                )

            }
        );

        cargarDatos();

    }
);

// ======================
// SUBIR EXCEL
// ======================

document.getElementById(
    "excelForm"
).addEventListener(
    "submit",
    async(e)=>{

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

        const res =
        await fetch(
            `${API}/subir-excel`,
            {

                method:"POST",

                body:formData

            }
        );

        const data =
        await res.json();

        alert(
            data.mensaje
        );

        cargarDatos();

    }
);

// ======================
// DESCARGAR EXCEL
// ======================

document.getElementById(
    "descargarExcel"
).addEventListener(
    "click",
    ()=>{

        window.open(
            `${API}/descargar-inventario`
        );

    }
);
// ======================
// CERRAR SESION
// ======================

function cerrarSesion(){

    localStorage.removeItem(
        "adminLogeado"
    );

    window.location.href =
    "login.html";

}
// ======================
// ACTUALIZAR ESTADO
// ======================

async function actualizarEstado(
    tabla,
    id,
    estado
){

    await fetch(
        `${API}/actualizar-estado/${tabla}/${id}`,
        {

            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                estado
            })

        }
    );

    cargarDatos();

}
// ======================
// ELIMINAR INVENTARIO
// ======================

async function eliminarInventario(
    id
){

    const confirmar =
    confirm(
        "¿Eliminar registro?"
    );

    if(!confirmar) return;

    await fetch(
        `${API}/inventario/${id}`,
        {

            method:"DELETE"

        }
    );

    cargarDatos();

}
// ======================
// EDITAR INVENTARIO
// ======================

async function editarInventario(
    id,
    nombreActual,
    modeloActual,
    serieActual
){

    const nombre =
    prompt(
        "Nombre:",
        nombreActual
    );

    if(nombre === null) return;

    const modelo =
    prompt(
        "Modelo:",
        modeloActual
    );

    if(modelo === null) return;

    const serie =
    prompt(
        "Serie:",
        serieActual
    );

    if(serie === null) return;

    await fetch(
        `${API}/inventario/${id}`,
        {

            method:"PUT",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({

                nombre,
                modelo,
                serie

            })

        }
    );

    cargarDatos();

}
// ======================
// PDF INVENTARIO
// ======================

document.getElementById(
    "descargarPDF"
).addEventListener(
    "click",
    ()=>{

        window.open(
            `${API}/pdf-inventario`
        );

    }
);