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
4. Install setup application software Node.js & npm and server software nginx & pm2
    ```sh
    sudo apt install -y nodejs
    sudo apt install -y npm
    sudo apt install -y nginx
    sudo npm i -gy pm2
    ```
5. Clone the project and install its dependencies
    ```sh
    git clone https://github.com/SethCram/book-club.git
    cd book-club/api/
    sudo npm install -y 
    cd ../client/
    sudo npm install -y
    ```
