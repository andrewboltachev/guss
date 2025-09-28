import type { JSX } from "react"
import { useState } from "react"
import styles from "./Rounds.module.css"
import { useGetRoundsQuery } from "./roundsApiSlice"

const options = [5, 10, 20, 30]

export const Rounds = (): JSX.Element | null => {
  const [numberOfRounds, setNumberOfRounds] = useState(10)
  // Using a query hook automatically fetches data and returns query values
  const { data, isError, isLoading, isSuccess } =
    useGetRoundsQuery(numberOfRounds)

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <h3>Select the Quantity of Rounds to Fetch:</h3>
        <select
          className={styles.select}
          value={numberOfRounds}
          onChange={e => {
            setNumberOfRounds(Number(e.target.value))
          }}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {data.rounds.map(({ author, round, id }) => (
          <blockround key={id}>
            &ldquo;{round}&rdquo;
            <footer>
              <cite>{author}</cite>
            </footer>
          </blockround>
        ))}
      </div>
    )
  }

  return null
}
