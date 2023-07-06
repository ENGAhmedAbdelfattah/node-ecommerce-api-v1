const Tokens = require("csrf");

const generateCSRFToken = async () => {
  try {
    // Generate a CSRF token
    const tokens = new Tokens();

    // const secret = tokens.secretSync(); or const secret = await tokens.secret(); #Sync or async
    const csrfSecret = await tokens.secret(); // store it in session for login user and send it to frontend

    // send secret to frontend
    const tokensF = new Tokens(); // this line in frontend (attacker should use same package and get secret to can hack you)
    const token = tokensF.create(csrfSecret); // this line in frontend (attacker should use same package and get secret to can hack you)

    // Retrieve server secret asynchronously csrfProtect function

    if (!csrfSecret) {
      throw new Error("Failed to retrieve server secret");
    }

    if (!tokens.verify(csrfSecret, token)) {
      throw new Error("Invalid token!");
    }

    // Token is valid
    console.log("Token is valid ok ok ok 3");
  } catch (error) {
    // Handle any errors
    console.error(error);
  }
};

// Call the function to generate and validate the CSRF token
generateCSRFToken();
