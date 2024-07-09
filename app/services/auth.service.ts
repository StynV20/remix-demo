// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./server.session";
import { Response, User } from "~/models/user.model";
import { FormStrategy } from "remix-auth-form";
import { jwtDecode } from "jwt-decode";

const login = async (code: string | null) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: process.env.GRANT_TYPE ?? "",
      client_id: process.env.CLIENT_ID ?? "",
      client_secret: process.env.CLIENT_SECRET ?? "",
      redirect_uri: process.env.REDIRECT_URI ?? "",
      code: code ?? "",
    }).toString(),
  };

  try {
    const result = await fetch(
      "https://samples.auth0.com/oauth/token",
      requestOptions
    );

    const data: Response = await result.json();
    return jwtDecode<User>(data.id_token);
  } catch (error) {
    console.log("error: " + error);
    return null;
  }
};

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const code: string = form.get("code")?.toString() ?? "";
    const user = await login(code);
    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method

    if (!user) {
      throw new Error("Invalid login attempt");
    }
    return user;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
);
