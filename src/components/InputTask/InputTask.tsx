import { useState } from "react";
import { Button } from "../Button";
import styles from './InputTask.module.scss';
import { customAxios } from "@/api";



export const InputTask: React.FC<{ onTaskAdded: () => void }> = ({ onTaskAdded }) => {
    const [task, setTask] = useState('');
    const handleAddTask = async () => {
        try {
            await customAxios({
            url: '/todos',
            method: 'POST',
            data: {
                title: task,
                completed: false,
                date: new Date().toISOString()
                }
            })
            setTask('');
            onTaskAdded();
        } catch (error) {
            console.error(error);
        }
    }
    return <div className={styles.inputTask}>
        <input type="text" placeholder="Add a new task" value={task} onChange={(e) => setTask(e.target.value)} />
        <Button onClick={handleAddTask}>Add</Button>
    </div>
}