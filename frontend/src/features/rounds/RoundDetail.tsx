import { type JSX, type MouseEventHandler, useEffect, useRef } from "react"
import { useAddRoundMutation, useGetRoundQuery, useGetRoundsQuery } from "./roundsApi.ts"
import { Card, CardBody, CardFooter, CardHeader, Container } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { NavLink, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import ArrowBack from "./ArrowBack.tsx"
import type { FullRoundInfo } from "./types.ts"
import goose from '../../assets/goose.png';
import cooldownGoose from '../../assets/cooldownGoose.png';
import finishedGoose from '../../assets/finishedGoose.png';
import { parseISO } from "date-fns"
import { activate, finish } from "./roundsSlice.ts"

const ActiveGoose = ({ data }: { data: FullRoundInfo }) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <strong>Статус: {data.status}</strong>
      </CardHeader>
      <CardBody className="text-center">
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
          }}
        >
          <img alt="Goose!" src={goose} style={{ maxWidth: "calc(min(30vh, 80vw))" }} />
        </a>
      </CardBody>
      <CardFooter className="d-flex justify-content-center align-items-center">
        <div>
          <table>
            <tbody>
            <tr>
              <th className="p-1">Всего:</th>
              <td className="p-1 text-end">{data.totalScore}</td>
            </tr>
            {!!data.winnerName && <tr>
              <th className="p-1">Победитель — {data.winnerName}:</th>
              <td className="p-1 text-end">{data.bestScore}</td>
            </tr>}
            <tr>
              <th className="p-1">Мои очки:</th>
              <td className="p-1 text-end">{data.score}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </CardFooter>
    </Card>
  )
};

const CooldownGoose = ({ data }: { data: FullRoundInfo }) => {
};

const FinishedGoose = ({ data }: { data: FullRoundInfo }) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <strong>Статус: {data.status}</strong>
      </CardHeader>
      <CardBody className="text-center">
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
          }}
        >
          <img alt="Goose!" src={finishedGoose} style={{ maxWidth: "calc(min(30vh, 80vw))" }} />
        </a>
      </CardBody>
      <CardFooter className="d-flex justify-content-center align-items-center">
        <div>
          <table>
            <tbody>
              <tr>
                <th className="p-1">Всего:</th>
                <td className="p-1 text-end">{data.totalScore}</td>
              </tr>
              {!!data.winnerName && <tr>
                <th className="p-1">Победитель — {data.winnerName}:</th>
                <td className="p-1 text-end">{data.bestScore}</td>
              </tr>}
              <tr>
                <th className="p-1">Мои очки:</th>
                <td className="p-1 text-end">{data.score}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardFooter>
    </Card>
  )
};

export const RoundDetail = (): JSX.Element | null => {
  const { id } = useParams();
  const { isError, isLoading } = useGetRoundQuery(String(id), { skip : !id });
  const { round: data, startTime, endTime } = useAppSelector(state => state.activeRound)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!startTime || !endTime) return; // Если ещё не загрузились данные
    function f() {
      if (!startTime || !endTime) return; // Не должно происходить, а ! отключён в ESLint

      const now = new Date().getTime();
      if (!data) return;
      if (now >= endTime) {
        dispatch(finish());
      } else {
        if (now >= startTime) {
          dispatch(activate());
        }
        timeoutRef.current = setTimeout(f, 500); // Не финиш
      }
    }
    f();
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    }
  }, [startTime, endTime, data, dispatch]);


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

  if (!id || !data) return <div>Не та страница...</div>;

  const { status } = data;

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
      <Card>
        <CardHeader className="text-center">
          <strong>Статус: {data.status}</strong>
        </CardHeader>
        <CardBody className="text-center">
          <a
            href="#"
            onClick={e => {
              e.preventDefault()
            }}
          >
            <img alt="Goose!" src={cooldownGoose} style={{ maxWidth: "calc(min(30vh, 80vw))" }} />
          </a>
        </CardBody>
        <CardFooter className="d-flex justify-content-center align-items-center">
          <div>
            <table>
              <tbody>
              <tr>
                <th className="p-1 text-center">Cooldown</th>
              </tr>
              <tr>
                <th className="p-1 text-center">До начала — </th>
              </tr>
              </tbody>
            </table>
          </div>
        </CardFooter>
      </Card>


    </Container>
  );
}

export default RoundDetail;
