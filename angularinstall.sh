cat << 'EOF' > setup_angular.sh
#!/bin/zsh

echo "🚀 Starting Angular CLI setup..."

# 1. Create the local npm directory
mkdir -p ~/.npm-global

# 2. Tell npm to use this directory for global packages
npm config set prefix '~/.npm-global'

# 3. Add the new path to .zshrc if it's not already there
IF_EXISTS=$(grep "export PATH=\$HOME/.npm-global/bin:\$PATH" ~/.zshrc)
if [ -z "$IF_EXISTS" ]; then
    echo 'export PATH=$HOME/.npm-global/bin:$PATH' >> ~/.zshrc
    echo "✅ Added PATH to ~/.zshrc"
else
    echo "ℹ️ PATH already exists in ~/.zshrc"
fi

# 4. Update the current session's PATH
export PATH=$HOME/.npm-global/bin:$PATH

# 5. Install Angular CLI
echo "📦 Installing @angular/cli..."
npm install -g @angular/cli

# 6. Final check
echo "✨ Setup complete! Testing 'ng' command..."
ng version