const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || (isProduction ? 8000 : 8080);
const APP_PATH = process.cwd();
const PUBLIC_PATH = '/public/';
const BUILD_PATH = '.build';

module.exports = {
  PORT,
  APP_PATH,
  PUBLIC_PATH,
  BUILD_PATH,
};
