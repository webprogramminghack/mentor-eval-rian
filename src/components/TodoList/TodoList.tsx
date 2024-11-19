import { customAxios } from '@/api';
import styles from './TodoList.module.scss';
import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

type Todo = {
    id: string;
    title: string;
    completed: boolean;
};

export const TodoList: React.FC<{ onTaskAdded: () => void }> = ({ onTaskAdded }) => {
    // const [spinner, setSpinner] = useState(true);
    const [todo, setTodo] = useState<Todo>({
        id: '',
        title: '',
        completed: false
    });
    const [edit, setEdit] = useState(false);
    
    const { data: todos, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = useInfiniteQuery(
        {
            queryKey: ['todos'],
            queryFn: fetchTodos,
            initialPageParam: 0,
            getNextPageParam: (lastPage: any) => {
                console.log(lastPage,'lastPage');
                return lastPage.data.nextCursor || undefined;
            },
        }
    );

    async function fetchTodos({pageParam = 0}) {
        console.log(pageParam,'pageParam');
        try {
            const data = await customAxios({
                url: `/todos/scroll?nextCursor=${pageParam}&limit=10&sort=date&order=desc`,
                method: 'GET',
            });
            console.log(data,'dataaaaaa');
            return data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            return { todos: [], nextCursor: null };
        }
    }

    useEffect(() => {
        refetch();
    }, [onTaskAdded]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight && hasNextPage) {
                fetchNextPage();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleCheckboxChange = async (id: string, completed: boolean, title: string) => {
        try {
            await customAxios({
                url: `/todos/${id}`,
                method: 'PUT',
                data: {
                    completed,
                    title,
                    date: new Date().toISOString()
                }
            });
            refetch();
            setEdit(false);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await customAxios({
                url: `/todos/${id}`,
                method: 'DELETE',
            });
            refetch();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleEditForm = (todo: Todo) => {
        setTodo(todo);
        setEdit(true);
    };

    if (isLoading) return <div >Loading...</div>;
    if (isError) return <div>Error fetching todos</div>;
    console.log(todos,'todos');
    

    return (
        <div>
            <ul className={styles.todoList}>
                {todos?.pages.map((page: any) => page?.data.todos.map((todo: Todo) => (
                    <React.Fragment key={todo.id}>
                        <li className={styles.todoItem} key={todo.id}>
                            <input type="checkbox" checked={todo.completed} onChange={() => handleCheckboxChange(todo.id, !todo.completed, todo.title)} />
                        <button onClick={() => handleEditForm(todo)}>{todo.title}</button>
                            <button className={styles.deleteButton} onClick={() => handleDelete(todo.id)}></button>
                        </li>
                    </React.Fragment>
                )))}
                    <button type='button' className={styles.loadmore} onClick={() => fetchNextPage()}>
                        {isFetchingNextPage ? (
                            <div className={styles.spinnerContainer} style={{display: isFetchingNextPage ? 'block' : 'none'}}>
                                <ClipLoader color="#0093dd" size={20} className={styles.spinner} />
                            </div>
                        ) : hasNextPage ? ("loadmore"): null}
                    </button>
            </ul>
            {edit && 
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>Edit Task</h2>
                            <span className={styles.close} onClick={() => setEdit(false)}>X</span>
                        </div>
                        <input type="text" value={todo?.title} onChange={(e) => setTodo({...todo, title: e.target.value})} />
                        <button onClick={() => handleCheckboxChange(todo.id, todo.completed, todo.title)}>Save</button>
                    </div>
                </div>
            }
        </div>
    );
};