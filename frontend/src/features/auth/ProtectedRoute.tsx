import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../../app/hooks.ts"

const ProtectedRoute = () => {
  const { username } = useAppSelector(state => state.auth)

  if (!username) {
    return (
      <Navigate to="/login" />
    )
  }

  return <Outlet />
}
export default ProtectedRoute
