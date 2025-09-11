#!/bin/bash

# Configuration Variables
PROJECT_NAME="Ecommerce.Vue"
PROJECT_PATH="."
BUILD_OUTPUT="./dist"
PUBLISH_OUTPUT="./publish"
SERVER_IP="38.242.205.216"
SERVER_USER="Administrator"
SERVER_PATH="/C:/inetpub/wwwroot/ecommerce"
BACKUP_PATH="/C:/inetpub/wwwroot/ecommerce_backup"
APP_POOL_NAME="ecommerce"

# Password handling options (choose one method)
# Method 1: From environment variable
SERVER_PASSWORD="${SSH_PASSWORD}"

# Method 2: From .env file (uncomment if using)
# if [ -f ".env" ]; then
#     export $(grep -v '^#' .env | xargs)
#     SERVER_PASSWORD="${SSH_PASSWORD}"
# fi

# Method 3: Prompt for password (uncomment if using)
# echo -n "Enter server password: "
# read -s SERVER_PASSWORD
# echo

# Function to run SSH commands with password
ssh_with_password() {
    if [ -n "$SERVER_PASSWORD" ]; then
        sshpass -p "$SERVER_PASSWORD" ssh "$SERVER_USER@$SERVER_IP" "$1"
    else
        ssh "$SERVER_USER@$SERVER_IP" "$1"
    fi
}

# Function to run SCP commands with password
scp_with_password() {
    if [ -n "$SERVER_PASSWORD" ]; then
        sshpass -p "$SERVER_PASSWORD" scp "$@"
    else
        scp "$@"
    fi
}

# Check if sshpass is available when password method is used
check_sshpass() {
    if [ -n "$SERVER_PASSWORD" ] && ! command -v sshpass &> /dev/null; then
        echo -e "${RED}Error: sshpass is required for password authentication${NC}"
        echo -e "${YELLOW}Install with: brew install sshpass${NC}"
        exit 1
    fi
}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Vue.js Deployment Process...${NC}"

# Check if password authentication tools are available
check_sshpass

# Step 1: Clean previous build and publish folders
echo -e "${YELLOW}Step 1: Cleaning previous build folders...${NC}"
if [ -d "$BUILD_OUTPUT" ]; then
    rm -rf "$BUILD_OUTPUT"
    echo "Previous dist folder removed."
fi
if [ -d "$PUBLISH_OUTPUT" ]; then
    rm -rf "$PUBLISH_OUTPUT"
    echo "Previous publish folder removed."
fi

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm ci

# Check if npm install was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies. Exiting...${NC}"
    exit 1
fi

# Step 3: Build the Vue app for production
echo -e "${YELLOW}Step 3: Building Vue app for production...${NC}"
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Vue app built successfully${NC}"
else
    echo -e "${RED}✗ Failed to build Vue app. Exiting...${NC}"
    exit 1
fi

# Step 4: Prepare publish folder
echo -e "${YELLOW}Step 4: Preparing publish folder...${NC}"
mkdir -p "$PUBLISH_OUTPUT"
cp -r "$BUILD_OUTPUT"/* "$PUBLISH_OUTPUT/"

# Create web.config for IIS if it doesn't exist
if [ ! -f "$PUBLISH_OUTPUT/web.config" ]; then
    echo -e "${YELLOW}Creating web.config for IIS...${NC}"
    cat > "$PUBLISH_OUTPUT/web.config" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="Handle History Mode and Hash Mode" stopProcessing="true">
                    <match url="(.*)" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/" />
                </rule>
            </rules>
        </rewrite>
        <staticContent>
            <remove fileExtension=".js" />
            <mimeMap fileExtension=".js" mimeType="application/javascript" />
            <remove fileExtension=".css" />
            <mimeMap fileExtension=".css" mimeType="text/css" />
            <remove fileExtension=".json" />
            <mimeMap fileExtension=".json" mimeType="application/json" />
            <remove fileExtension=".woff" />
            <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
            <remove fileExtension=".woff2" />
            <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
        </staticContent>
        <httpCompression>
            <dynamicTypes>
                <add mimeType="application/javascript" enabled="true" />
                <add mimeType="text/css" enabled="true" />
            </dynamicTypes>
        </httpCompression>
    </system.webServer>
</configuration>
EOF
    echo -e "${GREEN}✓ web.config created${NC}"
fi

# Step 5: Stop IIS Application Pool
echo -e "${YELLOW}Step 5: Stopping IIS Application Pool '$APP_POOL_NAME'...${NC}"
ssh_with_password "powershell -Command \"Stop-WebAppPool -Name '$APP_POOL_NAME' -ErrorAction SilentlyContinue\""

# Wait a moment for the app pool to stop
sleep 3

# Step 6: Create backup of existing deployment
echo -e "${YELLOW}Step 6: Creating backup of existing deployment...${NC}"
ssh_with_password "powershell -Command \"if (Test-Path '$SERVER_PATH') { if (Test-Path '$BACKUP_PATH') { Remove-Item '$BACKUP_PATH' -Recurse -Force }; Move-Item '$SERVER_PATH' '$BACKUP_PATH' -Force }\""

# Step 7: Create target directory
echo -e "${YELLOW}Step 7: Creating target directory...${NC}"
ssh_with_password "powershell -Command \"New-Item -Path '$SERVER_PATH' -ItemType Directory -Force\""

# Step 8: Transfer published files to server
echo -e "${YELLOW}Step 8: Transferring files to server...${NC}"
scp_with_password -r "$PUBLISH_OUTPUT"/* "$SERVER_USER@$SERVER_IP:$SERVER_PATH/"

# Check if file transfer was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Files transferred successfully${NC}"
else
    echo -e "${RED}✗ Failed to transfer files. Rolling back...${NC}"
    # Rollback: restore backup
    ssh_with_password "powershell -Command \"if (Test-Path '$BACKUP_PATH') { Remove-Item '$SERVER_PATH' -Recurse -Force; Move-Item '$BACKUP_PATH' '$SERVER_PATH' -Force }\""
    exit 1
fi

# Step 9: Set proper permissions
echo -e "${YELLOW}Step 9: Setting permissions...${NC}"
ssh_with_password "powershell -Command \"icacls '$SERVER_PATH' /grant 'IIS_IUSRS:(OI)(CI)F' /T\""

# Step 10: Start IIS Application Pool
echo -e "${YELLOW}Step 10: Starting IIS Application Pool '$APP_POOL_NAME'...${NC}"
ssh_with_password "powershell -Command \"Start-WebAppPool -Name '$APP_POOL_NAME'\""

# Wait a moment for the app pool to start
sleep 5

# Step 11: Cleanup local publish folder
echo -e "${YELLOW}Step 11: Cleaning up local files...${NC}"
rm -rf "$PUBLISH_OUTPUT"

# Step 12: Test deployment
echo -e "${YELLOW}Step 12: Testing deployment...${NC}"
# Test if the main page loads
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_IP/ecommerce/")
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Deployment test successful (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${RED}⚠ Warning: Deployment test returned HTTP $HTTP_STATUS${NC}"
fi

echo -e "${GREEN}🎉 Vue.js Deployment completed successfully!${NC}"
echo -e "${GREEN}Application deployed to: http://$SERVER_IP/ecommerce/${NC}"

# Optional: Display deployment summary
echo -e "${YELLOW}Deployment Summary:${NC}"
echo -e "Project: $PROJECT_NAME"
echo -e "Server: $SERVER_IP"
echo -e "Path: $SERVER_PATH"
echo -e "Backup: $BACKUP_PATH"
echo -e "App Pool: $APP_POOL_NAME"
echo -e "URL: http://$SERVER_IP/ecommerce/"
echo -e "Status: ${GREEN}SUCCESS${NC}"

# Optional: Show recent deployment logs
echo -e "${YELLOW}Recent IIS Logs (last 5 entries):${NC}"
ssh_with_password "powershell -Command \"Get-EventLog -LogName Application -Source 'IIS*' -Newest 5 | Format-Table TimeGenerated, EntryType, Message -AutoSize\" 2>/dev/null || echo 'Could not retrieve IIS logs'"