const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Configuración de la base de datos SQLite
const dbPath = path.join(__dirname, 'tomin.db');
const db = new sqlite3.Database(dbPath);

// Inicializar las tablas
db.serialize(() => {
  // Tabla de usuarios
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT NOT NULL,
      plan TEXT DEFAULT 'free',
      stellarAddress TEXT UNIQUE,
      authMethod TEXT DEFAULT 'traditional',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      walletData TEXT DEFAULT '{}'
    )
  `);

  // Tabla de cajas de ahorro
  db.run(`
    CREATE TABLE IF NOT EXISTS savings_boxes (
      id TEXT PRIMARY KEY,
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      icon TEXT DEFAULT 'wallet',
      goal REAL NOT NULL,
      currentBalance REAL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);

  // Insertar usuario de prueba si no existe
  db.get("SELECT id FROM users WHERE email = 'test@tomin.com'", (err, row) => {
    if (!row) {
      db.run(`
        INSERT INTO users (email, password, name, plan, authMethod)
        VALUES ('test@tomin.com', 'password123', 'Ángeles', 'premium', 'traditional')
      `, function(err) {
        if (!err) {
          const userId = this.lastID;

          // Insertar cajas de ejemplo para el usuario de prueba (convertidas a MXN)
          const sampleBoxes = [
            { id: 'box-1', name: 'VIAJE A JAPÓN', icon: 'plane', goal: 1000000, currentBalance: 135600 },
            { id: 'box-2', name: 'CARRO NUEVO', icon: 'car', goal: 2400000, currentBalance: 90000 },
            { id: 'box-3', name: 'ENGANCHE DEPA', icon: 'home', goal: 6000000, currentBalance: 306000 },
            { id: 'box-4', name: 'FONDO EMERGENCIA', icon: 'health', goal: 400000, currentBalance: 400000 }
          ];

          sampleBoxes.forEach(box => {
            db.run(`
              INSERT OR IGNORE INTO savings_boxes (id, userId, name, icon, goal, currentBalance)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [box.id, userId, box.name, box.icon, box.goal, box.currentBalance]);
          });
        }
      });
    }
  });
});

// Funciones auxiliares para promisificar SQLite
const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// --- RUTAS DE AUTENTICACIÓN ---

// Login tradicional
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await dbGet(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (user) {
      const { password, ...userData } = user;
      res.json({ success: true, user: userData, token: 'fake-jwt-token-123' });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Autenticación/Registro automático con Accesly
app.post('/api/auth/accesly', async (req, res) => {
  try {
    const { stellarAddress, email, walletData } = req.body;

    if (!stellarAddress) {
      return res.status(400).json({
        success: false,
        message: 'Stellar address es requerida'
      });
    }

    // Buscar usuario existente por stellarAddress o email
    let user = await dbGet(
      "SELECT * FROM users WHERE stellarAddress = ? OR (email = ? AND email IS NOT NULL)",
      [stellarAddress, email]
    );

    if (user) {
      // Usuario existente - actualizar datos si es necesario
      if (!user.stellarAddress) {
        await dbRun(
          "UPDATE users SET stellarAddress = ? WHERE id = ?",
          [stellarAddress, user.id]
        );
        user.stellarAddress = stellarAddress;
      }
      if (email && !user.email) {
        await dbRun(
          "UPDATE users SET email = ? WHERE id = ?",
          [email, user.id]
        );
        user.email = email;
      }

      console.log(`✅ Usuario existente conectado: ${user.name} (${stellarAddress})`);
    } else {
      // Crear nuevo usuario automáticamente
      const newUserData = {
        email: email || `${stellarAddress.slice(0, 8)}@accesly.wallet`,
        password: null,
        name: email ? email.split('@')[0] : `Usuario Accesly`,
        plan: 'free',
        stellarAddress: stellarAddress,
        authMethod: 'accesly',
        walletData: JSON.stringify(walletData || {})
      };

      const result = await dbRun(`
        INSERT INTO users (email, password, name, plan, stellarAddress, authMethod, walletData)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        newUserData.email,
        newUserData.password,
        newUserData.name,
        newUserData.plan,
        newUserData.stellarAddress,
        newUserData.authMethod,
        newUserData.walletData
      ]);

      user = await dbGet("SELECT * FROM users WHERE id = ?", [result.lastID]);

      console.log(`🚀 Nuevo usuario creado automáticamente: ${user.name} (${stellarAddress})`);
    }

    // Retornar usuario sin datos sensibles
    const { password, ...userData } = user;
    res.json({
      success: true,
      user: userData,
      token: `accesly-token-${stellarAddress.slice(0, 8)}`,
      message: user.id > 1 ? 'Usuario creado automáticamente' : 'Bienvenido de vuelta'
    });
  } catch (error) {
    console.error('Error en autenticación Accesly:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Registro tradicional
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await dbGet("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El correo ya está en uso' });
    }

    const result = await dbRun(`
      INSERT INTO users (email, password, name, plan, authMethod)
      VALUES (?, ?, ?, 'free', 'traditional')
    `, [email, password, name]);

    const newUser = await dbGet("SELECT * FROM users WHERE id = ?", [result.lastID]);
    const { password: _, ...userData } = newUser;

    res.status(201).json({ success: true, user: userData, token: 'fake-jwt-token-123' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// --- RUTAS DE CAJAS DE AHORRO ---

// Obtener todas las cajas de un usuario
app.get('/api/boxes', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    if (!userId) {
      return res.status(400).json({ success: false, message: 'ID de usuario requerido' });
    }

    const boxes = await dbAll(
      "SELECT * FROM savings_boxes WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    res.json({ success: true, data: boxes });
  } catch (error) {
    console.error('Error obteniendo cajas:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Crear una caja nueva
app.post('/api/boxes', async (req, res) => {
  try {
    const { userId, name, icon, goal } = req.body;

    if (!userId || !name || !goal) {
      return res.status(400).json({
        success: false,
        message: 'Datos requeridos: userId, name, goal'
      });
    }

    const boxId = 'box-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);

    await dbRun(`
      INSERT INTO savings_boxes (id, userId, name, icon, goal, currentBalance)
      VALUES (?, ?, ?, ?, ?, 0)
    `, [boxId, parseInt(userId), name.toUpperCase(), icon || 'wallet', parseFloat(goal)]);

    const newBox = await dbGet("SELECT * FROM savings_boxes WHERE id = ?", [boxId]);

    res.status(201).json({ success: true, data: newBox });
  } catch (error) {
    console.error('Error creando caja:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Actualizar una caja (editar)
app.put('/api/boxes/:id', async (req, res) => {
  try {
    const boxId = req.params.id;
    const { name, icon, goal } = req.body;

    // Verificar que la caja existe
    const existingBox = await dbGet("SELECT * FROM savings_boxes WHERE id = ?", [boxId]);
    if (!existingBox) {
      return res.status(404).json({ success: false, message: 'Caja no encontrada' });
    }

    // Construir query dinámicamente solo con campos enviados
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name.toUpperCase());
    }
    if (icon !== undefined) {
      updates.push("icon = ?");
      values.push(icon);
    }
    if (goal !== undefined) {
      updates.push("goal = ?");
      values.push(parseFloat(goal));
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    updates.push("updatedAt = CURRENT_TIMESTAMP");
    values.push(boxId);

    await dbRun(
      `UPDATE savings_boxes SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedBox = await dbGet("SELECT * FROM savings_boxes WHERE id = ?", [boxId]);

    res.json({
      success: true,
      data: updatedBox,
      message: 'Caja actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando caja:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Eliminar una caja (solo si currentBalance es 0)
app.delete('/api/boxes/:id', async (req, res) => {
  try {
    const boxId = req.params.id;

    const box = await dbGet("SELECT * FROM savings_boxes WHERE id = ?", [boxId]);

    if (!box) {
      return res.status(404).json({ success: false, message: 'Caja no encontrada' });
    }

    if (box.currentBalance > 0) {
      return res.status(400).json({
        success: false,
        message: `No puedes eliminar una caja con dinero. Balance actual: $${box.currentBalance.toFixed(2)} MXN`
      });
    }

    await dbRun("DELETE FROM savings_boxes WHERE id = ?", [boxId]);

    res.json({
      success: true,
      message: 'Caja eliminada exitosamente',
      deletedBox: box
    });
  } catch (error) {
    console.error('Error eliminando caja:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Depositar en una caja
app.post('/api/boxes/:id/deposit', async (req, res) => {
  try {
    const boxId = req.params.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Cantidad inválida' });
    }

    const box = await dbGet("SELECT * FROM savings_boxes WHERE id = ?", [boxId]);

    if (!box) {
      return res.status(404).json({ success: false, message: 'Caja no encontrada' });
    }

    const newBalance = box.currentBalance + parseFloat(amount);

    await dbRun(
      "UPDATE savings_boxes SET currentBalance = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [newBalance, boxId]
    );

    const updatedBox = await dbGet("SELECT * FROM savings_boxes WHERE id = ?", [boxId]);

    res.json({
      success: true,
      data: updatedBox,
      message: `Depósito de $${amount} MXN exitoso`
    });
  } catch (error) {
    console.error('Error en depósito:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Retirar de una caja
app.post('/api/boxes/:id/withdraw', async (req, res) => {
  try {
    const boxId = req.params.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Cantidad inválida' });
    }

    const box = await dbGet("SELECT * FROM savings_boxes WHERE id = ?", [boxId]);

    if (!box) {
      return res.status(404).json({ success: false, message: 'Caja no encontrada' });
    }

    if (box.currentBalance < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: `Fondos insuficientes. Balance actual: $${box.currentBalance.toFixed(2)} MXN`
      });
    }

    const newBalance = box.currentBalance - parseFloat(amount);

    await dbRun(
      "UPDATE savings_boxes SET currentBalance = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [newBalance, boxId]
    );

    const updatedBox = await dbGet("SELECT * FROM savings_boxes WHERE id = ?", [boxId]);

    res.json({
      success: true,
      data: updatedBox,
      message: `Retiro de $${amount} MXN exitoso`
    });
  } catch (error) {
    console.error('Error en retiro:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Obtener estadísticas de un usuario
app.get('/api/users/:id/stats', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const stats = await dbGet(`
      SELECT
        COUNT(*) as totalBoxes,
        COALESCE(SUM(currentBalance), 0) as totalBalance,
        COALESCE(SUM(goal), 0) as totalGoals,
        COALESCE(AVG(currentBalance * 100.0 / goal), 0) as averageProgress
      FROM savings_boxes
      WHERE userId = ?
    `, [userId]);

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Cerrar la base de datos al terminar el proceso
process.on('SIGINT', () => {
  console.log('\n🔄 Cerrando base de datos...');
  db.close((err) => {
    if (err) {
      console.error('Error cerrando la base de datos:', err.message);
    } else {
      console.log('✅ Base de datos cerrada correctamente');
    }
    process.exit(0);
  });
});

// Arrancar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('====================================');
  console.log(`🚀 Backend Tomin (Savings Boxes) con SQLite`);
  console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`💾 Base de datos: ${dbPath}`);
  console.log(`💰 Moneda: Pesos Mexicanos (MXN)`);
  console.log(`\n👤 Usuario de prueba:`);
  console.log(`- Email: test@tomin.com`);
  console.log(`- Password: password123`);
  console.log(`\n📦 Funcionalidades:`);
  console.log(`- ✅ Crear cajas de ahorro`);
  console.log(`- ✅ Editar cajas (nombre, meta, icono)`);
  console.log(`- ✅ Eliminar cajas (solo sin dinero)`);
  console.log(`- ✅ Depositar y retirar fondos`);
  console.log(`- ✅ Integración completa con Accesly`);
  console.log('====================================');
});