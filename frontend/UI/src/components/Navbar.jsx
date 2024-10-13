import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ContextUser } from "../store/userData";
function Navbar() {
  const { data, setUserData, getUserData, deleteUserData } =
    useContext(ContextUser);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [data]);
  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary"
        style={{ margin: "0px", padding: "0px" }}
      >
        <div
          className="container-fluid"
          style={{ backgroundColor: "#92e685", padding: "10px" }}
        >
          <a className="navbar-brand" href="#">
            MyChess
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul
              className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
              style={{ "--bs-scroll-height": " 100px" }}
            >
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to={"/"}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                {user === null ? (
                  <Link className="nav-link" to={"/signin"}>
                    Signin
                  </Link>
                ) : (
                  <Link
                    className="nav-link"
                    onClick={() => {
                      deleteUserData();
                    }}
                  >
                    Logout
                  </Link>
                )}
              </li>
              <li className="nav-item">
                {user !== null ? (
                  <Link className="nav-link">{user.username}</Link>
                ) : null}
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
