import type { JSX } from "react"
import styles from "./Rounds.module.css"
import { useGetRoundsQuery } from "./roundsApiSlice"

export const Rounds = (): JSX.Element | null => {
  const { data, isError, isLoading, isSuccess } = useGetRoundsQuery();

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
        <h3>Rounds:</h3>
        {data.map(({ id }) => (
          <blockquote key={id}>
            &ldquo;{id}&rdquo;
            <footer>
              <cite>{'woo'}</cite>
            </footer>
          </blockquote>
        ))}
      </div>
    )
  }

  return null
}
