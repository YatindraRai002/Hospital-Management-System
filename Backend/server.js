import app from './app.js';
import cloudinary from 'cloudinary';
import { dbConnection } from './database/dbConnection.js';

//configure cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const startServer = async () => {
  try {
    // Connect to database first
    await dbConnection();
    console.log('✅ Database connected successfully');
    
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Frontend URLs allowed: ${process.env.FRONTEND_URL}, ${process.env.DASHBOARD_URL}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();