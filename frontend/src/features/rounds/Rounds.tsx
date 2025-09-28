import type { JSX } from "react"
import { useGetRoundsQuery } from "./roundsApiSlice"
import { Container } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { logout } from "../auth/authSlice.ts"

export const Rounds = (): JSX.Element | null => {
  const { data, isError, isLoading, isSuccess } = useGetRoundsQuery();
  const { username } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  if (isError) {
    return (
      <Container className="my-3 text-black-50">
        <h1>There was an error!!!</h1>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container className="my-3 text-black-50">
        <h1>Loading...</h1>
      </Container>
    )
  }

  if (isSuccess) {
    return (
      <Container>
        <div className="row align-items-stretch">
          <div className="col-6">
            <h3 className="my-3">Rounds List</h3>
          </div>
          <div className="col-6 d-flex align-items-center" style={{columnGap: 10}}>
            <strong>Пользователь:</strong> {username}
            <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => {
              dispatch(logout());
            }}>Выйти</button>
          </div>
        </div>
        {data.map(({ id }) => (
          <blockquote key={id}>
            &ldquo;{id}&rdquo;
            <footer>
              <cite>{'woo'}</cite>
            </footer>
          </blockquote>
        ))}
      </Container>
    )
  }

  return null
}

export default Rounds;
