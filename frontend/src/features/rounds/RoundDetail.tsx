import { type JSX, type MouseEventHandler } from "react"
import { useAddRoundMutation, useGetRoundQuery, useGetRoundsQuery } from "./roundsApiSlice"
import { Container } from "react-bootstrap"
import { useAppSelector } from "../../app/hooks.ts"
import { NavLink, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import ArrowBack from "./ArrowBack.tsx"

export const RoundDetail = (): JSX.Element | null => {
  const { id } = useParams();
  const { data, isError, isLoading, isSuccess } = useGetRoundQuery(String(id), { skip : !id });

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

  if (!id) return <div>Не та страница...</div>;

  if (isSuccess) {
    return (
      <Container>
        <div className="row align-items-stretch">
          <div className="col-9">
            <h3 className="my-3">Раунд {id}</h3>
          </div>
          <div className="col-3 d-flex align-items-center justify-content-end">
            <NavLink to="/" className="btn btn-outline-secondary d-inline-flex align-items-center">
              <ArrowBack className="me-1" />
              К списку раундов
            </NavLink>
          </div>
        </div>
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      </Container>
    )
  }

  return null
}

export default RoundDetail;
