# Book-Club
- A creative writing application leveraging MongoDB, Express, React, Node (MERN stack)
- basis: https://www.youtube.com/watch?v=tlTdbc5byAs&list=PLj-4DlPRT48lGpll2kC4wOsLj7SEV_lYu

## Developer Notes

- Test data script manages fake posts, users, categories, votes, and comments
  - all linked together
  - from api directory: 
    - insertion: `node seedData.js -i -p # -u # -c #`
    - deletion: `node seedData.js -d`
- CkEditor features can be added or removed:
  - download from https://ckeditor.com/ckeditor-5/online-builder/
  - unzip folder into client folder 
  - rename unzipped folder into "ckeditor5"
  - run "npm add file:./ckeditor5" in the client directory

### Environment File
1. MONGO_URL should be found through MongoDB Atlas "Deployment" > Database > Connect > Drivers > Driver as "Node.js" version "4.1 or later", then copy & paste connection string, and replace <password> with the password for the given user
2. DEV_PASSWORD is recommended to be a complex passwords 
3. JWT_ACCESS_SECRET_KEY and JWT_REFRESH_SECRET_KEY should be extremely complex and distinct since they won't be required for direct usage, just authentication
3. ENV should be set to "PROD" (e.g. ENV="PROD")
4. FILE_STORAGE_URL should be set to wherever the uploaded images are supposed to be stored 
  
### Developer Setup Instructions
1. Install Node.js v16 & npm  
    ```sh
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo apt install -y npm
    ```
    1. Verify nodejs is version 16 `node -v`
    2. If nodejs is lower than v16, install nvm and update to the right node.js version:
        ```sh
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
        command -v nvm
        ```
        If "command -v nvm" doesn't output "nvm", logout and relogin, and then:
        ```sh
        nvm install 16.17.1
        ```
2. Clone the project and install the project dependencies
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
3. Fill out the environment setup file
    ```sh
    vi api/.env
    ```
    Refer to https://github.com/SethCram/book-club/README.md#environment-file for more details.
4. Start the api and client by running `npm start` in their respective directories in different terminals
  
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
    2. If nodejs is lower than v16, install nvm and update to the right node.js version:
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
    1. If any npm install hangs, reboot the instance and reconnect to it and then setup debugging: 
        ```sh
        npm config set loglevel info
        npm install --verbose
        ```
6. Copy the example environment setup file for the api
    ```sh
    cd api
    cp .env.example .env
    cd ..
    ```
7. Fill out the environment setup file
    ```sh
    vi api/.env
    ```
    Refer to https://github.com/SethCram/book-club/README.md#environment-file for more details.
8. Manually start both the api and the client to ensure they both work in isolation
    ```sh
    npm start 
    cd ../client/
    npm start 
    cd ..
    ```
9. Make sure pm2 runs the required processes on server restart
    ```sh
    pm2 startup
    sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v16.17.1/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
    ```
10. Indefinitely run the api, then verify and save it to run on server restart 
    ```sh
    cd api
    pm2 start --name api npm -- start
    pm2 logs 
    pm2 save
    cd ..
    ```
11. Setup nginx to direct external api requests to the api
    ```sh
    sudo vi /etc/nginx/sites-available/default
    ```
    add this inside the "server" block, replacing the "location" block with:
    ```
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    ```
12. Setup nginx to direct external website connections to the client
    ```sh
    sudo vi /etc/nginx/sites-available/default
    ```
    add this inside the "server" block, replacing "root" with:
    ```
    root /var/www/html;
    ```

13. Verify the syntax of the nginx config file is okay and start nginx using it
    ```sh
    sudo nginx -t
    sudo service nginx restart
    ```
14. Copy the production build files to their proper location `sudo cp -r ./client/build/* /var/www/html`
15. Login to MongoDB Atlas and go "Security" > "Network Access" > "Add IP Address", then add both the public and private IP of the AWS EC2 instance (visible under EC2 instance details)
    1. This step will need redoing if the Amazon EC2 instance is stopped and then started again since the public IP address changes, but not if the instance is rebooted
16. Navigate to the public IP address using http (e.g. http://[publicIPAddress]) and the frontend should be visible or use curl to verify `curl http://[publicIPAddress]`
