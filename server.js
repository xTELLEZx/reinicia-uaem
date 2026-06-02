const PDFDocument =
require("pdfkit");
const express = require("express");

const app = express();

app.use(express.static(__dirname));
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT =
process.env.PORT || 3000;

// ======================
// MIDDLEWARES
// ======================

app.use(cors());
app.use(express.json());

// ======================
// SQLITE
// ======================

const db = new sqlite3.Database("./inventario.db", (err) => {

    if (err) {
        console.log("Error SQLite:", err);
    } else {
        console.log("SQLite conectado");
    }

});

// ======================
// CREAR TABLAS
// ======================

db.serialize(() => {

    // ======================
    // INVENTARIO
    // ======================

    db.run(`
        CREATE TABLE IF NOT EXISTS inventario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            modelo TEXT,
            serie TEXT
        )
    `);

    // ======================
    // DONACIONES
    // ======================

    db.run(`
        CREATE TABLE IF NOT EXISTS donaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            correo TEXT,
            equipo TEXT,
            estadoEquipo TEXT,
            estado TEXT DEFAULT 'pendiente',
            fecha TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ======================
    // SOLICITUDES
    // ======================

    db.run(`
        CREATE TABLE IF NOT EXISTS solicitudes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            matricula TEXT,
            carrera TEXT,
            motivo TEXT,
            estado TEXT DEFAULT 'pendiente',
            fecha TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ======================
    // VOLUNTARIOS
    // ======================

    db.run(`
        CREATE TABLE IF NOT EXISTS voluntarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            correo TEXT,
            area TEXT,
            estado TEXT DEFAULT 'pendiente',
            fecha TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ======================
    // CONTACTOS
    // ======================

    db.run(`
        CREATE TABLE IF NOT EXISTS contactos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            correo TEXT,
            mensaje TEXT,
            fecha TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

});
// ======================
// MULTER
// ======================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }

        cb(null, "./uploads");

    },

    filename: function (req, file, cb) {

        cb(null, Date.now() + "-" + file.originalname);

    }

});

const upload = multer({ storage });

// ======================
// INVENTARIO
// ======================

app.get("/inventario", (req, res) => {

    db.all(
        "SELECT * FROM inventario ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});

// ======================
// SUBIR EXCEL
// ======================

app.post(
    "/subir-excel",
    upload.single("excel"),
    (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    mensaje:
                    "No se subió archivo"
                });

            }

            const workbook =
            XLSX.readFile(
                req.file.path
            );

            const sheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

            // ======================
            // LEER EXCEL NORMAL
            // ======================

            const datos =
            XLSX.utils.sheet_to_json(
                sheet
            );

            console.log(datos);

            let insertados = 0;

            datos.forEach(
                (item) => {

                    const nombre =
                    item.nombre || "";

                    const modelo =
                    item.modelo || "";

                    const serie =
                    item.serie || "";

                    if(
                        nombre ||
                        modelo ||
                        serie
                    ){

                        db.run(
                            `
                            INSERT INTO inventario
                            (nombre, modelo, serie)
                            VALUES (?, ?, ?)
                            `,
                            [
                                nombre,
                                modelo,
                                serie
                            ]
                        );

                        insertados++;

                    }

                }
            );

            res.json({

                mensaje:
                "Excel subido correctamente",

                registros:
                insertados

            });

        } catch(error){

            console.log(error);

            res.status(500).json({

                mensaje:
                "Error al subir Excel"

            });

        }

    }
);
// ======================
// DONACIONES
// ======================

app.post("/donaciones", (req, res) => {

    const {
        nombre,
        correo,
        equipo,
        estadoEquipo
    } = req.body;

    db.run(
        `
        INSERT INTO donaciones
        (nombre, correo, equipo, estadoEquipo)
        VALUES (?, ?, ?, ?)
        `,
        [
            nombre,
            correo,
            equipo,
            estadoEquipo
        ],

        function (err) {

            if (err) {

                return res.status(500).json(err);

            }

            res.json({
                mensaje: "Donación guardada",
                id: this.lastID
            });

        }

    );

});

// ======================
// CONTADOR DONACIONES
// ======================

app.get("/contador-donaciones", (req, res) => {

    db.get(
        "SELECT COUNT(*) as total FROM donaciones",
        [],
        (err, row) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(row);

        }
    );

});

// ======================
// VER SQLITE
// ======================

app.get("/sqlite", (req, res) => {

    db.all(
        "SELECT * FROM donaciones",
        [],
        (err, donaciones) => {

            db.all(
                "SELECT * FROM solicitudes",
                [],
                (err, solicitudes) => {

                    db.all(
                        "SELECT * FROM voluntarios",
                        [],
                        (err, voluntarios) => {

                            db.all(
                                "SELECT * FROM contactos",
                                [],
                                (err, contactos) => {

                                    db.all(
                                        "SELECT * FROM inventario",
                                        [],
                                        (err, inventario) => {

                                            res.json({

                                                donaciones:
                                                donaciones || [],

                                                solicitudes:
                                                solicitudes || [],

                                                voluntarios:
                                                voluntarios || [],

                                                contactos:
                                                contactos || [],

                                                inventario:
                                                inventario || []

                                            });

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});

// ======================
// ROOT
// ======================

app.get("/", (req, res) => {

    res.send("Servidor funcionando");

});

// ======================
// AGREGAR INVENTARIO
// ======================

app.post("/inventario", (req, res) => {

    const {
        nombre,
        modelo,
        serie
    } = req.body;

    db.run(
        `
        INSERT INTO inventario
        (nombre, modelo, serie)
        VALUES (?, ?, ?)
        `,
        [
            nombre,
            modelo,
            serie
        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({
                mensaje:"Inventario agregado"
            });

        }

    );

});

// ======================
// DESCARGAR INVENTARIO
// ======================

app.get(
    "/descargar-inventario",
    (req, res) => {

        db.all(
            "SELECT * FROM inventario",
            [],
            (err, rows) => {

                if(err){

                    return res
                    .status(500)
                    .json(err);

                }

                const worksheet =
                    XLSX.utils.json_to_sheet(
                        rows
                    );

                const workbook =
                    XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(
                    workbook,
                    worksheet,
                    "Inventario"
                );

                const ruta =
                    "./inventario.xlsx";

                XLSX.writeFile(
                    workbook,
                    ruta
                );

                res.download(ruta);

            }
        );

    }
);
// ======================
// SOLICITUDES
// ======================

app.post("/solicitudes", (req,res)=>{

    const {
        nombre,
        matricula,
        carrera,
        motivo
    } = req.body;

    db.run(
        `
        INSERT INTO solicitudes
        (nombre, matricula, carrera, motivo)
        VALUES (?, ?, ?, ?)
        `,
        [
            nombre,
            matricula,
            carrera,
            motivo
        ],

        function(err){

            if(err){

                return res
                .status(500)
                .json(err);

            }

            res.json({
                mensaje:"Solicitud guardada"
            });

        }

    );

});

// ======================
// VOLUNTARIOS
// ======================

app.post("/voluntarios", (req,res)=>{

    const {
        nombre,
        correo,
        area
    } = req.body;

    db.run(
        `
        INSERT INTO voluntarios
        (nombre, correo, area)
        VALUES (?, ?, ?)
        `,
        [
            nombre,
            correo,
            area
        ],

        function(err){

            if(err){

                return res
                .status(500)
                .json(err);

            }

            res.json({
                mensaje:"Voluntario guardado"
            });

        }

    );

});

// ======================
// CONTACTOS
// ======================

app.post("/contactos", (req,res)=>{

    const {
        nombre,
        correo,
        mensaje
    } = req.body;

    db.run(
        `
        INSERT INTO contactos
        (nombre, correo, mensaje)
        VALUES (?, ?, ?)
        `,
        [
            nombre,
            correo,
            mensaje
        ],

        function(err){

            if(err){

                return res
                .status(500)
                .json(err);

            }

            res.json({
                mensaje:"Mensaje guardado"
            });

        }

    );

});
// ======================
// ELIMINAR INVENTARIO
// ======================

app.delete(
    "/inventario",
    (req, res) => {

        db.run(
            "DELETE FROM inventario",
            [],

            function(err){

                if(err){

                    return res
                    .status(500)
                    .json(err);

                }

                res.json({
                    mensaje:
                    "Inventario eliminado"
                });

            }

        );

    }
);
// ======================
// ACTUALIZAR ESTADOS
// ======================

app.put(
    "/actualizar-estado/:tabla/:id",
    (req, res) => {

        const tabla =
        req.params.tabla;

        const id =
        req.params.id;

        const {
            estado
        } = req.body;

        db.run(
            `
            UPDATE ${tabla}
            SET estado = ?
            WHERE id = ?
            `,
            [
                estado,
                id
            ],

            function(err){

                if(err){

                    return res
                    .status(500)
                    .json(err);

                }

                res.json({

                    mensaje:
                    "Estado actualizado"

                });

            }

        );

    }
);

// ======================
// ELIMINAR INVENTARIO INDIVIDUAL
// ======================

app.delete(
    "/inventario/:id",
    (req, res) => {

        const id =
        req.params.id;

        db.run(
            `
            DELETE FROM inventario
            WHERE id = ?
            `,
            [id],

            function(err){

                if(err){

                    return res
                    .status(500)
                    .json(err);

                }

                res.json({

                    mensaje:
                    "Inventario eliminado"

                });

            }

        );

    }
);
// ======================
// EDITAR INVENTARIO
// ======================

app.put(
    "/inventario/:id",
    (req, res) => {

        const id =
        req.params.id;

        const {
            nombre,
            modelo,
            serie
        } = req.body;

        db.run(
            `
            UPDATE inventario
            SET
            nombre = ?,
            modelo = ?,
            serie = ?
            WHERE id = ?
            `,
            [
                nombre,
                modelo,
                serie,
                id
            ],

            function(err){

                if(err){

                    return res
                    .status(500)
                    .json(err);

                }

                res.json({

                    mensaje:
                    "Inventario actualizado"

                });

            }

        );

    }
);

// ======================
// PDF INVENTARIO
// ======================

app.get(
    "/pdf-inventario",
    (req, res) => {

        db.all(
            "SELECT * FROM inventario",
            [],
            (err, rows) => {

                if(err){

                    return res
                    .status(500)
                    .json(err);

                }

                const doc =
                new PDFDocument();

                res.setHeader(
                    "Content-Type",
                    "application/pdf"
                );

                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=inventario.pdf"
                );

                doc.pipe(res);

                doc
                .fontSize(22)
                .text(
                    "Inventario Reinicia-UAEM",
                    {
                        align:"center"
                    }
                );

                doc.moveDown();

                rows.forEach(
                    (item)=>{

                        doc
                        .fontSize(14)
                        .text(
                            `
ID: ${item.id}

Nombre:
${item.nombre}

Modelo:
${item.modelo}

Serie:
${item.serie}

--------------------------------
                            `
                        );

                    }
                );

                doc.end();

            }
        );

    }
);
// ======================
// SERVER
// ======================

app.listen(PORT, () => {

    console.log(`Servidor corriendo en http://localhost:${PORT}`);

});