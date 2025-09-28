import { type ChangeEvent, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useNavigate } from 'react-router-dom';

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

function LoginForm() {
  const navigate = useNavigate();

  // State for form credentials, explicitly typed as strings
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // State for local form validation feedback
  const [validated, setValidated] = useState<boolean>(false);

  // RTK Query mutation hook is destructured and typed by the hook itself
  const [login, { isLoading, error, isError }] = useLoginMutation();

  // The submit handler event is explicitly typed as React.FormEvent<HTMLFormElement>
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget; // TypeScript infers this as HTMLFormElement

    // Perform browser validation check
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      await login({ username, password }).unwrap();

      await navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const apiError = error as ApiError | undefined;

  const errorMessage = apiError?.data?.message || 'Login failed. Please check your credentials.';

  return (
    <Card style={{ maxWidth: "400px", margin: "50px auto" }}>
      <Card.Body>
        <Card.Title className="text-center">Log In</Card.Title>

        {isError && <Alert variant="danger">{errorMessage}</Alert>}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
