import "./login.css";

import { useMoralis } from "react-moralis";

function Login() {
  const { authenticate, authError} = useMoralis();
  return (
    <div className="login_container">
      <div className="login_card">
       
        <div className="sign_in_container">
          {authError && (
            <p className="error">
              {authError.name} <br/>
              {authError.message}
            </p>
          )}
          <button
            onClick={authenticate}
          >
            Login with Moralis
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;


