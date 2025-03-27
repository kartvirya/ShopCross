// Set up NODE_ENV as production before importing the main application
process.env.NODE_ENV = 'production';

// This file is used to start the app in production environments like Render
// It simply imports and runs the compiled application
import './dist/index.js';