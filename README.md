# Book-Club
- A creative writing application leveraging MongoDB, Express, React, Node (MERN stack)
- basis: https://www.youtube.com/watch?v=tlTdbc5byAs&list=PLj-4DlPRT48lGpll2kC4wOsLj7SEV_lYu

## Developer Notes
### Developer Instructions
- Node.js must be installed
- Project dependencies can be installed via "npm install" in the respective directories
- Both the api and client can be started running "npm start"
- Test data script manages fake posts, users, categories, votes, and comments
  - all linked together
  - from api dir: 
    - insertion: `node seedData.js -i -p # -u # -c #`
    - deletion: `node seedData.js -d`
- CkEditor features can be added or removed:
  - download from https://ckeditor.com/ckeditor-5/online-builder/
  - unzip folder into client folder 
  - rename unzipped folder into "ckeditor5"
  - run "npm add file:./ckeditor5" in the client directory
### Packages
- Nodemon is installed for a responsive api
- Mongoose connects the API to MongoDB Atlas through NodeJS
- Multer allows for file posting to the API
- Uses Axios to communicate between frontend React and Express API
- Icons retrieved from Font Awesome

## Deployment Notes

The Deployment Instructions assume the project is being deployed onto AWS. The only changes necessary to deploy it elsewhere is to ensure port 80 is open to HTTP traffic and port 443 to HTTPS traffic.

### Deployment Instructions
1. Launch a new EC2 instance on AWS:
    1. Select Ubuntu as the OS image
    2. Generate a new .pem key pair for SSH 
    3. Allow SSH, HTTPS, and HTTP traffic from anywhere on the internet
    4. Set the storage to 20GB (arbitrarily) 
2. Wait for the Instance State to read "Running" 
3. Go into the instance > Connect > EC2 Instance Connect > Connect
    1. If this doesn't work, go into the SSH client tab and follow the below steps, otherwise continue to step 4
    2. Then copy & paste the last part of the "Example:" into Putty as the Session
    3. Open up PuttyGen, "Load" the .pem key, and "Save private key" as .ppk
    4. In Putty, Connection > SSH > Auth > Credentials > and choose "Private key file for authentication" as the .ppk we just generated
    5. When prompted, choose to Accept
4. Install setup application software Node.js v16 & npm and server software nginx & pm2    
    ```sh
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo apt install -y npm
    sudo apt install -y nginx
    sudo npm i -gy pm2
    ```
    1. Verify nodejs is version 16 `node -v`
    2. If nodejs is lower than v16, instal kvm and updating to the right node.js version:
        ```sh
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
        command -v nvm
        ```
        If "command -v nvm" doesn't output "nvm", logout and relogin, and then:
        ```sh
        nvm install 16.17.1
        ```
5. Clone the project and install its dependencies
    ```sh
    git clone https://github.com/SethCram/book-club.git
    cd book-club/api/
    npm install
    cd ../client/ckeditor5/
    npm install
    cd ..
    npm install 
    cd ..
    ```
    1. If any npm install hangs, reboot the instance and reconnect to it and then: 
        ```sh
        npm config set loglevel info
        npm install --verbose
        ```
6. Copy the example environment setup file for the api
    ```sh
    cd api
    cp .env.example .env
    ```
7. Fill out the environment setup file
    ```sh
    vi .env
    ```
    1. MONGO_URL should be found through MongoDB Atlas "Deployment" > Database > Connect > Drivers > Driver as "Node.js" version "4.1 or later", then copy & paste connection string, and replace <password> with the password for the given user
    2. DEV_PASSWORD is recommended to be a complex passwords 
    3. JWT_ACCESS_SECRET_KEY and JWT_REFRESH_SECRET_KEY should be extremely complex and distinct since they won't be required for direct usage, just authentication
    3. ENV should be set to "PROD" (e.g. ENV="PROD")
8. Manually start both the api and the client to ensure they both work in isolation
    ```sh
    npm start 
    cd ../client/
    npm start 
    cd ..
    ```
9. Indefinitely run both the api and the client, then verify 
    ```sh
    cd api
    pm2 start --name api-dashboard npm -- start
    cd ../client/ 
    pm2 start --name client-dashboard npm -- start
    pm2 logs 
    ```
10. Setup nginx to direct external traffic to the client
    ```sh
    sudo vi /etc/nginx/sites-available/default
    ```
    add this inside the "server" > "location" block:
    ```
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    ```
    verify the syntax of the config file is okay and start nginx using it
    ```sh
    sudo nginx -t
    sudo service nginx restart
    ```
11. Navigate to the public IP address using http (e.g. http://[publicIPAddress]) and the frontend should be visible or use curl to verify `curl http://[publicIPAddress]`
