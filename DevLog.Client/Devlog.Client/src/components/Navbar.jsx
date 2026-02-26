import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <ul>
        <li>home</li>
        <li>
          <Link to="/posts/create">create</Link>
        </li>
        <li>
          <Link to="/posts/2/edit">edit</Link>
        </li>
        <li>
          <Link to="/posts/2">view</Link>
        </li>
      </ul>
    </>
  );
}

export default Navbar;
