const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'FACCI-MAP',
  password: '12345',
  port: 5432,
});

// REGISTRO: Solo estudiantes desde el frontend
app.post('/api/usuarios', async (req, res) => {
  const { nombres, apellidos, edad, cedula, fechaNacimiento, correo, contrasena, carrera, semestre } = req.body;
  try {
    // 1. Insertar en Usuario (rol por defecto: estudiante)
    const result = await pool.query(
      `INSERT INTO Usuario (nombres, apellidos, correo, contrasena, fecha_nacimiento, cedula, edad, rol)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'estudiante') RETURNING id_usuario`,
      [nombres, apellidos, correo, contrasena, fechaNacimiento, cedula, edad]
    );
    const id_usuario = result.rows[0].id_usuario;

    // 2. Insertar en Estudiante
    await pool.query(
      `INSERT INTO Estudiante (id_estudiante, matricula, carrera, semestre)
       VALUES ($1, $2, $3, $4)`,
      [id_usuario, cedula, carrera || null, semestre || null]
    );

    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    console.error('ERROR EN BACKEND:', err);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM Usuario WHERE correo = $1 AND contrasena = $2',
      [correo, contrasena]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, usuario: result.rows[0] });
    } else {
      res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error('ERROR EN LOGIN:', err);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
});

// Obtener todos los usuarios o buscar por correo
app.get('/api/usuarios', async (req, res) => {
  const { correo } = req.query;
  try {
    if (correo) {
      const result = await pool.query('SELECT * FROM Usuario WHERE correo = $1', [correo]);
      res.json(result.rows);
    } else {
      const result = await pool.query('SELECT * FROM Usuario ORDER BY id_usuario ASC');
      res.json(result.rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const { nombres, apellidos, fecha_nacimiento, cedula, edad, rol } = req.body;
  try {
    await pool.query(
      `UPDATE Usuario SET
        nombres = $1,
        apellidos = $2,
        fecha_nacimiento = $3,
        cedula = $4,
        edad = $5,
        rol = $6
      WHERE id_usuario = $7`,
      [nombres, apellidos, fecha_nacimiento, cedula, edad, rol, id]
    );
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener materias
app.get('/api/materias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Materia ORDER BY id_materia ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Añadir materia
app.post('/api/materias', async (req, res) => {
  const { nombre_materia, nivel, paralelo } = req.body;
  try {
    await pool.query(
      'INSERT INTO Materia (nombre_materia, nivel, paralelo) VALUES ($1, $2, $3)',
      [nombre_materia, nivel, paralelo]
    );
    res.status(201).json({ message: 'Materia añadida' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener horarios de una materia
app.get('/api/materias/:id/horarios', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Horario WHERE id_materia = $1 ORDER BY dia_semana, hora_inicio', [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las facultades
app.get('/api/facultades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Facultad ORDER BY nombre_facultad');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener edificios por facultad
app.get('/api/edificios', async (req, res) => {
  const { id_facultad } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM Edificio WHERE id_facultad = $1 ORDER BY nombre_edificio',
      [id_facultad]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener pisos por edificio
app.get('/api/pisos', async (req, res) => {
  const { id_edificio } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM Piso WHERE id_edificio = $1 ORDER BY numero_piso',
      [id_edificio]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener aulas por piso
app.get('/api/aulas', async (req, res) => {
  const { id_piso } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM Aula WHERE id_piso = $1 ORDER BY nombre_aula',
      [id_piso]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear aula
app.post('/api/aulas', async (req, res) => {
  const { nombre_aula, id_piso } = req.body;
  try {
    await pool.query(
      'INSERT INTO Aula (nombre_aula, id_piso) VALUES ($1, $2)',
      [nombre_aula, id_piso]
    );
    res.json({ message: 'Aula creada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las aulas con info de piso, edificio y facultad
app.get('/api/aulas_full', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id_aula, a.nombre_aula, 
        p.numero_piso, 
        e.nombre_edificio, 
        f.nombre_facultad
      FROM Aula a
      JOIN Piso p ON a.id_piso = p.id_piso
      JOIN Edificio e ON p.id_edificio = e.id_edificio
      JOIN Facultad f ON e.id_facultad = f.id_facultad
      ORDER BY f.nombre_facultad, e.nombre_edificio, p.numero_piso, a.nombre_aula
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guardar horario (con verificación de traslape)
app.post('/api/materias/:id/horarios', async (req, res) => {
  const { id } = req.params;
  const { dia_semana, hora_inicio, hora_fin, id_usuario, id_aula } = req.body;
  try {
    // Verifica traslape de horarios en el aula
    const overlap = await pool.query(
      `SELECT 1 FROM Horario
       WHERE id_aula = $1 AND dia_semana = $2
       AND (
         (hora_inicio < $4 AND hora_fin > $3)
       )`,
      [id_aula, dia_semana, hora_inicio, hora_fin]
    );
    if (overlap.rowCount > 0) {
      return res.status(400).json({ error: 'Ya existe un horario asignado a esa aula en ese horario.' });
    }
    await pool.query(
      'INSERT INTO Horario (id_materia, dia_semana, hora_inicio, hora_fin, id_usuario, id_aula) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, dia_semana, hora_inicio, hora_fin, id_usuario, id_aula]
    );
    res.json({ message: 'Horario guardado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar horario
app.delete('/api/horarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Horario WHERE id_horario = $1', [id]);
    res.json({ message: 'Horario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear facultad
app.post('/api/facultades', async (req, res) => {
  const { nombre_facultad } = req.body;
  try {
    await pool.query(
      'INSERT INTO Facultad (nombre_facultad) VALUES ($1)',
      [nombre_facultad]
    );
    res.json({ message: 'Facultad creada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear edificio
app.post('/api/edificios', async (req, res) => {
  const { nombre_edificio, id_facultad } = req.body;
  try {
    await pool.query(
      'INSERT INTO Edificio (nombre_edificio, id_facultad) VALUES ($1, $2)',
      [nombre_edificio, id_facultad]
    );
    res.json({ message: 'Edificio creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear piso
app.post('/api/pisos', async (req, res) => {
  const { numero_piso, id_edificio } = req.body;
  try {
    await pool.query(
      'INSERT INTO Piso (numero_piso, id_edificio) VALUES ($1, $2)',
      [numero_piso, id_edificio]
    );
    res.json({ message: 'Piso creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NUEVO: Obtener horarios por usuario con detalles de materia, aula, piso, edificio y facultad
app.get('/api/usuarios/:id_usuario/horarios', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    // Averigua el rol del usuario
    const userRes = await pool.query('SELECT rol FROM usuario WHERE id_usuario = $1', [id_usuario]);
    if (userRes.rows.length === 0) return res.json([]);
    const rol = userRes.rows[0].rol;

    let result;
    if (rol === 'estudiante') {
      // Solo horarios de materias asignadas al estudiante
      result = await pool.query(`
        SELECT h.id_horario, h.dia_semana, h.hora_inicio, h.hora_fin,
               m.nombre_materia, m.nivel, m.paralelo,
               a.nombre_aula,
               p.numero_piso,
               e.nombre_edificio,
               f.nombre_facultad,
               u.nombres AS nombres_docente,
               u.apellidos AS apellidos_docente
        FROM horario h
        JOIN materia m ON h.id_materia = m.id_materia
        JOIN aula a ON h.id_aula = a.id_aula
        JOIN piso p ON a.id_piso = p.id_piso
        JOIN edificio e ON p.id_edificio = e.id_edificio
        JOIN facultad f ON e.id_facultad = f.id_facultad
        LEFT JOIN usuario u ON h.id_usuario = u.id_usuario
        WHERE h.id_materia IN (
          SELECT id_materia FROM estudiante_materia WHERE id_usuario = $1
        )
        ORDER BY h.dia_semana, h.hora_inicio
      `, [id_usuario]);
    } else {
      // Docente o admin: todos los horarios donde es responsable
      result = await pool.query(`
        SELECT h.id_horario, h.dia_semana, h.hora_inicio, h.hora_fin,
               m.nombre_materia, m.nivel, m.paralelo,
               a.nombre_aula,
               p.numero_piso,
               e.nombre_edificio,
               f.nombre_facultad,
               u.nombres AS nombres_docente,
               u.apellidos AS apellidos_docente
        FROM horario h
        JOIN materia m ON h.id_materia = m.id_materia
        JOIN aula a ON h.id_aula = a.id_aula
        JOIN piso p ON a.id_piso = p.id_piso
        JOIN edificio e ON p.id_edificio = e.id_edificio
        JOIN facultad f ON e.id_facultad = f.id_facultad
        LEFT JOIN usuario u ON h.id_usuario = u.id_usuario
        WHERE h.id_usuario = $1
        ORDER BY h.dia_semana, h.hora_inicio
      `, [id_usuario]);
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guardar materias impartidas por un docente
app.put('/api/docentes/:id_usuario/materias', async (req, res) => {
  const { id_usuario } = req.params;
  const { materias } = req.body; // array de id_materia
  try {
    // Elimina las materias actuales del docente
    await pool.query('DELETE FROM Docente_Materia WHERE id_usuario = $1', [id_usuario]);
    // Inserta las nuevas materias
    for (const id_materia of materias) {
      await pool.query(
        'INSERT INTO Docente_Materia (id_usuario, id_materia) VALUES ($1, $2)',
        [id_usuario, id_materia]
      );
    }
    res.json({ message: 'Materias del docente actualizadas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Materias recibidas por estudiante
app.get('/api/estudiantes/:id_usuario/materias', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      'SELECT id_materia FROM Estudiante_Materia WHERE id_usuario = $1',
      [id_usuario]
    );
    res.json(result.rows.map(r => r.id_materia));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//docente materias impartidas
app.get('/api/docentes/:id_usuario/materias', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      'SELECT id_materia FROM Docente_Materia WHERE id_usuario = $1',
      [id_usuario]
    );
    res.json(result.rows.map(r => r.id_materia));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Borrar usuario
app.delete('/api/usuarios/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    // Esto eliminará el usuario y, gracias a las claves foráneas ON DELETE CASCADE, también sus relaciones
    await pool.query('DELETE FROM usuario WHERE id_usuario = $1', [id_usuario]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('API corriendo en http://localhost:3001'));