import { useState } from 'react';
import { useAuth } from './useAuth';

export const useRegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();

  const validateForm = () => {
    if (!username || !password) {
      setError('Username and password are required');
      return false;
    }
    setError(null);
    return true;
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        await register({ username, password });
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  return {
    username,
    password,
    error,
    handleInputChange,
    setUsername,
    setPassword,
    handleRegister,
  };
};
