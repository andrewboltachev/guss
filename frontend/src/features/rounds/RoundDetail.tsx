import { useEffect, useRef } from "react"
import { useGetRoundQuery } from "./roundsApi.ts"
import { Card, CardBody, CardFooter, CardHeader, Container } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts"
import { NavLink, useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import ArrowBack from "./ArrowBack.tsx"
import activeGoose from '../../assets/goose.png';
import cooldownGoose from '../../assets/cooldownGoose.png';
import finishedGoose from '../../assets/finishedGoose.png';
import { activate, setTillEnd, setTillStart } from "./roundsSlice.ts"

const images: Record<string, string> = {
  activeGoose,
  cooldownGoose,
  finishedGoose,
}

export const RoundDetail = () => {
  const { id } = useParams();
  const { isError, isLoading } = useGetRoundQuery(String(id), { skip : !id });
  const { round: data, startTime, endTime, tillStart, tillEnd } = useAppSelector(state => state.activeRound)
  const navigate = useNavigate();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!data || !startTime || !endTime) return; // Если ещё не загрузились данные
    if (data.status === 'finished') return; // Для finished не запускать

    function f() {
      if (!startTime || !endTime) return; // Не должно происходить, а ! отключён в ESLint

      const now = new Date().getTime();
      if (!data) return;
      const tillEnd = endTime - now;
      const tillStart = startTime - now;
      // console.log(tillStart, tillEnd);
      if (tillEnd > 0) {
        if (tillStart > 0) {
          // cooldown
          dispatch(setTillStart(tillStart));
        } else {
          dispatch(setTillEnd(tillEnd));
          if (data.status !== 'active') dispatch(activate());
        }
        timeoutRef.current = setTimeout(f, 500); // Не финиш
      } else {
        // Перезагрузить, чтобы отобразилось для finished
        void navigate(0);
      }
    }
    f();
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    }
  }, [startTime, endTime, data, dispatch, navigate]);


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
              e.preventDefault();
              if (data.status === 'active') {
                // ...
              }
            }}
          >
            <img alt="Goose!" src={images[`${data.status}Goose`]} style={{ maxWidth: "calc(min(30vh, 80vw))" }} />
          </a>
        </CardBody>
        <CardFooter className="d-flex justify-content-center align-items-center">
          <div>
            {/* Active */}
            {status === 'active' && <table>
              <tbody>
              <tr>
                <th className="p-1 text-center">Раунд активен!</th>
              </tr>
              <tr>
                <th className="p-1 text-center">Мои очки — {data.score || '⋯'}</th>
              </tr>
              <tr>
                <th className="p-1 text-center">Ещё осталось: {tillEnd} сек.</th>
              </tr>
              </tbody>
            </table>}
            {/* Cooldown */}
            {status === 'cooldown' && <table>
              <tbody>
              <tr>
                <th className="p-1 text-center">Cooldown</th>
              </tr>
              <tr>
                <th className="p-1 text-center">До начала — {tillStart} сек.</th>
              </tr>
              </tbody>
            </table>}
            {/* Finished */}
            {status === 'finished' && <table>
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
            </table>}
          </div>
        </CardFooter>
      </Card>


    </Container>
  );
}

export default RoundDetail;
