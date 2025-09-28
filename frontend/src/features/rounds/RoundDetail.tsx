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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = parseISO(data.startedAt).getTime();
  const dispatch = useAppDispatch();
  useEffect(() => {
    function f() {
      //console.log("<UNK>")
      const now = new Date().getTime();
      if (now >= startTime) {
        dispatch(activate());
      }
      timeoutRef.current = setTimeout(f, 500);
    }
    f();
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    }
  }, []);
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
  )
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
  const { data, isError, isLoading } = useGetRoundQuery(String(id), { skip : !id });

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
      {status === 'active' && (
        <ActiveGoose data={data} />
      )}
      {status === 'cooldown' && (
        <CooldownGoose data={data} />
      )}
      {status === 'finished' && (
        <FinishedGoose data={data} />
      )}
    </Container>
  );
}

export default RoundDetail;
