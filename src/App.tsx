import React from 'react';
// import { Button } from './components/Button';
import { InputTask } from './components/InputTask';
import { TodoList } from './components/TodoList';
import { useState } from 'react';
// import { TodoList } from './components/TodoList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Container } from './components/Container';
import { Header } from './components/Header';
const queryClient = new QueryClient();
const App: React.FC = () => {
  const [taskAdded, setTaskAdded] = useState(false);

  const handleTaskAdded = () => {
    setTaskAdded(prev => !prev);
  }

  return (<QueryClientProvider client={queryClient}>
    <ReactQueryDevtools />
    <Container>
      <Header />
      <InputTask onTaskAdded={handleTaskAdded} />
      <TodoList onTaskAdded={handleTaskAdded} />
    </Container>
  </QueryClientProvider>);
};

export default App;
