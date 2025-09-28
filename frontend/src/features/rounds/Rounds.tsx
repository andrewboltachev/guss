import type { JSX } from "react"
import { useGetRoundsQuery } from "./roundsApiSlice"
import { Container } from "react-bootstrap"

export const Rounds = (): JSX.Element | null => {
  const { data, isError, isLoading, isSuccess } = useGetRoundsQuery();

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
        <h3>Rounds:</h3>
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
