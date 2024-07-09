DOCUMENTAION 
=======================================================================

HOW TO SET UP NODE.JS AND EXPRESS
1. Create a folder in your destop with the title of your project then open gitbash 
2. Type in the following commands
- npm init -y (to start a new node.js project)
- npm install express (to install express)
- npm install nodemon (to install nodemon)
- npm install dotenv (to install dotenv)
- npm install mongoose (to install mongoose)
- npm install bcrypt (to install bcrypt)
- npm install jsonwebtoken (to install jsonwebtoken)
- npm install cors (to install cors)

LIST OF ENDPOINTS AND FUNCTIONALITIES
1. For Auth
- post  /register (to register a new user)
- post  /login (to login a user)
- get   /username (to get all users)
- get   /isloggedin (to know if the user is logged in)
- post  /forgot-password (to help for forgot password)
- put   /resetpassword/:resetToken (to reset password)
2. For Users
- get   /userprofile/:userId (to get users by ID)
- get   /all (to get all users)
- put   /update-profile (to update users information)
3. For Post
- post   /create (to create a post)
- delete /delete/:postId (to delete a post)
- put    /update/:postId (to update an existing post)

FOR TESTING ON POSTMAN
1. For Auth
- POST http://localhost:5119/api/v1/auth/register
- POST http://localhost:5119/api/v1/auth/login
- GET http://localhost:5119/api/v1/auth/isloggedin
- PUT http://localhost:5119/api/v1/auth/resetpassword/:resetToken (replace reset token where you see :resetToken)
- POST http://localhost:5119/api/v1/auth/forgot-password
2. For Users
- GET http://localhost:5119/api/v1/auth/username
- GET http://localhost:5119/api/v1/auth/userprofile/:userId (replace userId with the userid from mongodb)
- PUT http://localhost:5119/api/v1/auth/update-profile
- GET http://localhost:5119/api/v1/users/all
3. For Post
- POST http://localhost:5119/api/v1/posts/create
- DELETE http://localhost:5119/api/v1/posts/delete/:postId (replace postId with the postid from mongodb)
- PUT http://localhost:5119/api/v1/posts/update/:postId (replace postId with the postid from mongodb)



