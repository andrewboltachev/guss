import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../../app/hooks.ts"

const ProtectedRoute = () => {
  const auth = useAppSelector(state => state.auth)

  if (!auth.username) {
    return (
      <Navigate to="/login" />
    )
  }

  return <Outlet />
}
export default ProtectedRoute
