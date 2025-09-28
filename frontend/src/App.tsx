import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink, Route, Routes } from "react-router-dom"
import LoginForm from "./features/auth/LoginForm.tsx"
import RoundList from "./features/rounds/RoundList.tsx"
import ProtectedRoute from "./features/auth/ProtectedRoute.tsx"
import { logout } from "./features/auth/authSlice.ts"
import { useAppDispatch, useAppSelector } from "./app/hooks.ts"
import RoundDetail from "./features/rounds/RoundDetail.tsx"

export const App = () => {
  const { username } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Guss
          </NavLink>
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
          {!!username && <div className="d-flex align-items-center justify-content-end" style={{ columnGap: 10 }}>
            <strong>Пользователь:</strong> {username}
            <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => {
              dispatch(logout());
            }}>Выйти
            </button>
          </div>}
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="" element={<ProtectedRoute />}>
          <Route path="/" element={<RoundList />} />
          <Route path="/round/:id" element={<RoundDetail />} />
        </Route>
      </Routes>
    </div>
  );
}
