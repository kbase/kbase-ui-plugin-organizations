# set -e
# echo "Building plugin"
# cd react-app
# echo "Installing npm dependencies..."
# npm install
# echo "✓ dependencies installed successfully"
# echo "Building app..."
# npm run build
# echo "✓ built successfully"
# cd ..
# echo "Creating plugin distribution..."
# npm run install-plugin 
# echo "✓ plugin distribution created successfully" 
# echo "✓ plugin build completed"
cd tools/node
DIR=`pwd`/../../vite-app docker compose run --rm node npm install
DIR=`pwd`/../../vite-app docker compose run --rm node npm run build
DIR=`pwd`/../.. docker compose run --rm node npm install
DIR=`pwd`/../.. docker compose run --rm node npm run install-plugin