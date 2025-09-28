import { type ChangeEvent, type FormEventHandler, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Navigate, useNavigate } from "react-router-dom"

// interface LoginCredentials {
//   username: string;
//   password: string;
// }
//
// interface LoginResponse {
//   token: string;
//   user: {
//     id: number;
//     username: string;
//   };
// }

interface ApiError {
  status: number;
  data: {
    message: string;
  };
}

import { useLoginMutation } from './authApi';
import { useAppSelector } from "../../app/hooks.ts"

function LoginForm() {
  const auth = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [validated, setValidated] = useState<boolean>(false);

  const [login, { isLoading, error, isError }] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget; // TypeScript infers this as HTMLFormElement

    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await login({ username, password }).unwrap();

      await navigate('/', { replace: true });

    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const apiError = error as ApiError | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const errorMessage = apiError?.data?.message || 'Login failed. Please check your credentials.';

  if (auth.username) {
    return <Navigate to={`/`} />;
  }
  return (
    <Card style={{ maxWidth: "400px", margin: "50px auto" }}>
      <Card.Body>
        <Card.Title className="text-center">Log In</Card.Title>

        {isError && <Alert variant="danger">{errorMessage}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit as FormEventHandler<HTMLFormElement>}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter your username.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default LoginForm;
