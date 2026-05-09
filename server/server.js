import express from 'express';
import cors from 'cors';
import colors from 'colors';
import indexRoutes from '../routes/index.routes.js';
import { conectarMongoDB } from '../db/cnn_mongodb.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.apiPath = '/api';

    this.conectarDB();
    this.middlewares();
    this.routes();
  }

  async conectarDB() {
    await conectarMongoDB();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.apiPath, indexRoutes);

    this.app.use((req, res) => {
      res.status(404).send('Pagina no encontrada');
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(colors.green(`Servidor corriendo en http://localhost:${this.port}`));
    });
  }
}

export default Server;
