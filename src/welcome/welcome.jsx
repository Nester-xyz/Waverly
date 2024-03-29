import React from "react";
import ReactDOM from "react-dom/client";
import { identity } from "deso-protocol";

const Welcome = () => {
  return (
    <>
      <style>{`
        .welcome-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f3f4f6;
        }

        .welcome-title {
          font-size: 2rem;
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 2rem;
        }

        .login-container {
          background-color: white;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .login-button {
          background-color: #4299e1;
          color: white;
          font-weight: bold;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          transition: background-color 0.3s;
        }

        .login-button:hover {
          background-color: #2b6cb0;
        }
      `}</style>
      <div className="welcome-container">
        <h1 className="welcome-title">Welcome to WaverlyApp</h1>
        <div className="login-container">
          <button className="login-button" onClick={() => identity.login()}>
            Login/Signup
          </button>
        </div>
      </div>
    </>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Welcome />
    </React.StrictMode>
  );
}
