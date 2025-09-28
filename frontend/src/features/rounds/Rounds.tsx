import { type JSX, type MouseEventHandler } from "react"
import { useAddRoundMutation, useGetRoundsQuery } from "./roundsApiSlice"
import { Container } from "react-bootstrap"
import { useAppSelector } from "../../app/hooks.ts"
import { useNavigate } from "react-router-dom"

export const Rounds = (): JSX.Element | null => {
  const { data, isError, isLoading, isSuccess } = useGetRoundsQuery();
  const { username } = useAppSelector((state) => state.auth);
  const [addRound, ] = useAddRoundMutation();
  const navigate = useNavigate();

  const onNewRoundClick = async () => {
    try {
      const { id } = await addRound().unwrap();
      await navigate(id);
    } catch (error) {
      console.error(error); // TODO?
    }
  };

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
            <h3 className="my-3">Список раундов</h3>
          </div>
          <div className="col-6 d-flex align-items-center justify-content-end">
            {username === 'admin' && (
              <button
                type="button"
                className="btn btn-success"
                onClick={onNewRoundClick as MouseEventHandler<HTMLButtonElement>}
              >Создать раунд</button>
            )}
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
