const firebase  = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../firebase.json"); // Provide the path to your service account key file
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://todolist-e1b08-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const authMiddleware= async(request, response, next)=>{
    const headerToken = request.headers.authorization;
    if (!headerToken) {
      return response.send({ message: "No token provided" }).status(401);
    }
  
    if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
      response.send({ message: "Invalid token" }).status(401);
    }
  
    const token = headerToken.split(" ")[1];
    firebase
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        request.user=decodedToken
        // console.log("[decodedToken]",decodedToken)
        next()  
    }
        )
      .catch(() => response.send({ message: "Could not authorize" }).status(403));
  }
  

module.exports=authMiddleware 