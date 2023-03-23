# Book-Club
- A creative writing application leveraging MongoDB, Express, React, Node (MERN stack)
- basis: https://www.youtube.com/watch?v=tlTdbc5byAs&list=PLj-4DlPRT48lGpll2kC4wOsLj7SEV_lYu

## Developer Notes
### Instructions
- Node.js must be installed
- Project dependencies can be installed via "npm install" in the respective directories
- Both the api and client can be started running "npm start"
- Test data script manages fake posts, users, categories, votes, and comments
  - all linked together
  - from api dir: 
    - insertion: "node seedData.js -i -p # -u # -c #"
    - deletion: "node seedData.js -d"
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
