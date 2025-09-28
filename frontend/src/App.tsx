import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom"
import LoginForm from "./features/auth/LoginForm.tsx"
import Rounds from "./features/rounds/Rounds.tsx"
import ProtectedRoute from "./features/auth/ProtectedRoute.tsx"

export const App = () => (
  <div>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <a className="navbar-brand" href="#">
          Guss
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/*<div className="collapse navbar-collapse" id="navbarSupportedContent">*/}
        {/*  <ul className="navbar-nav me-auto mb-2 mb-lg-0">*/}
        {/*    <li className="nav-item">*/}
        {/*      <a className="nav-link active" aria-current="page" href="#">*/}
        {/*        Home*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*    <li className="nav-item">*/}
        {/*      <a className="nav-link" href="#">*/}
        {/*        Link*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*</div>*/}
      </div>
    </nav>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="/" element={<Rounds />} />
        {/*<Route path="/round/:id" element={<Rounds />} />*/}
      </Route>
    </Routes>
  </div>
)
