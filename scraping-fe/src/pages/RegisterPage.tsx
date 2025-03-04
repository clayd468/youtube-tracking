import { SyntheticEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ErrorMessage,
  FormField,
  Button,
} from '@/components/ui';
import { useRegisterForm } from '@/hooks/useRegisterForm';

export const RegisterPage = () => {
  const {
    username,
    password,
    error,
    handleInputChange,
    setUsername,
    setPassword,
    handleRegister,
  } = useRegisterForm();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await handleRegister();
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Scrape Media</CardTitle>
            <CardDescription>
              Enter your username & password below to register
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
            <Button type="submit">Register</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
