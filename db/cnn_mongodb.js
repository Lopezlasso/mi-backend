import mongoose from 'mongoose';
import colors from 'colors';

let isConnected = false;

export const conectarMongoDB = async () => {
  if (isConnected) {
    console.log(colors.yellow('MongoDB ya esta conectado'));
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI no esta definido en el entorno');
    }

    await mongoose.connect(mongoUri);

    isConnected = true;
    console.log(colors.green('MongoDB conectado correctamente'));
  } catch (error) {
    isConnected = false;
    console.error(colors.red('Error al conectar con MongoDB:'), error.message);
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log(colors.yellow('MongoDB desconectado'));
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(colors.yellow('Conexion MongoDB cerrada por finalizacion del proceso'));
  process.exit(0);
});
