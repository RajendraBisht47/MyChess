import { useContext, useState } from "react";
import "../components/css/Signin.css";
import { Context } from "../store/serverURL";
import { Link } from "react-router-dom";
import { ContextUser } from "../store/userData";
function Signin() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [message, setmessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [load, setload] = useState(false);
  const url = useContext(Context);
  const { data, setUserData, getUserData } = useContext(ContextUser);
  async function sendToServer(e) {
    e.preventDefault();
    setload(true);
    const res = await fetch(`${url}/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: "include",
    });
    const response = await res.json();
    setmessage(response.message);
    setSuccess(response.success);

    setusername("");
    setpassword("");
    if (response.success) {
      setUserData(response.user);
    }
    setload(false);

    // console.log(response);
  }
  return (
    <>
      <div className="formcontainer">
        {message !== "" ? (
          success ? (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          ) : (
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          )
        ) : null}

        <div
          className="mb-3 form-check"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {load ? (
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : null}
        </div>
        <form onSubmit={sendToServer}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Name
            </label>
            <input
              onChange={(value) => {
                setusername(value.target.value);
              }}
              required
              name="username"
              type="text"
              className="form-control"
              id="username"
              aria-describedby="emailHelp"
              value={username}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              onChange={(value) => {
                setpassword(value.target.value);
              }}
              required
              value={password}
              name="password"
              type="password"
              className="form-control"
              id="password"
            />
          </div>
          <div
            className="mb-3 form-check"
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Link className="form-check-label" to={"/login"}>
              Login if account already created.
            </Link>
          </div>
          <div
            className="mb-3 form-check"
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <button
              style={
                load
                  ? { display: "none", marginTop: "20px" }
                  : { marginTop: "20px" }
              }
              type="submit"
              className="btn btn-primary"
            >
              Signin
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default Signin;
