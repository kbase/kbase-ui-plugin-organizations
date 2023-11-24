set -e
echo "Building plugin"
cd vite-app
echo "Installing npm dependencies..."
npm install
echo "✓ dependencies installed successfully"
echo "Building app..."
npm run build
echo "✓ built successfully"
cd ..
echo "Creating plugin distribution..."
npm run install-plugin 
echo "✓ plugin distribution created successfully" 
echo "✓ plugin build completed"
