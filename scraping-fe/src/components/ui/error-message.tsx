import React from 'react';

interface ErrorMessageProps {
  message: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return <div className="text-red-500 text-sm">{message}</div>;
};

export { ErrorMessage };
