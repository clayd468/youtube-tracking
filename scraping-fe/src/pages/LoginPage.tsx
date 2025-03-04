import { SyntheticEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  ErrorMessage,
  FormField,
} from '@/components/ui';
import { useLoginForm } from '@/hooks';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  const {
    username,
    password,
    error,
    handleInputChange,
    setUsername,
    setPassword,
    handleLogin,
  } = useLoginForm();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Scrape Media</CardTitle>
            <CardDescription>
              Enter your username & password below to login
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <ErrorMessage message={error} />
            <FormField
              id="username"
              label="Username"
              value={username}
              onChange={handleInputChange(setUsername)}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
            />
            <div className="flex justify-center">
              <Link to="/register" className="no-underline">
                Register
              </Link>
            </div>
            <Button type="submit">Login</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
