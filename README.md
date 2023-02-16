# Book-Club
- A creative writing application leveraging MongoDB, Express, React, Node (MERN) stack
- basis: https://www.youtube.com/watch?v=tlTdbc5byAs&list=PLj-4DlPRT48lGpll2kC4wOsLj7SEV_lYu

## Developer Notes
### Instructions
- Both the api and client can be started running "npm start"
- Test data script manages fake posts, users, and categories 
  - all linked together
  - from api dir: 
    - insertion: "node seedData.js -i -p # -u # -c #"
    - deletion: "node seedData.js -d"
### Packages
- Nodemon is installed for a responsive api
- Mongoose connects the API to MongoDB Atlas through NodeJS
- Multer allows for file posting to the API
- Uses Axios to communicate between frontend React and Express API
- Icons retrieved from Font Awesome
