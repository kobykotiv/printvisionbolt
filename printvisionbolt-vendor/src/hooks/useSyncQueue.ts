import { useState, useCallback } from 'react';
import { SyncTask } from '../types/pod';

export function useSyncQueue() {
  const [tasks, setTasks] = useState<SyncTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addTask = useCallback((task: Omit<SyncTask, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newTask: SyncTask = {
      ...task,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
    processQueue();
  }, []);

  const processQueue = useCallback(async () => {
    if (isProcessing) return;
    
    const pendingTask = tasks.find(task => task.status === 'pending');
    if (!pendingTask) return;

    setIsProcessing(true);
    try {
      // Update task status to processing
      setTasks(prev => 
        prev.map(task => 
          task.id === pendingTask.id 
            ? { ...task, status: 'processing' as const, updatedAt: new Date() }
            : task
        )
      );

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update task status to completed
      setTasks(prev => 
        prev.map(task => 
          task.id === pendingTask.id 
            ? { ...task, status: 'completed' as const, updatedAt: new Date() }
            : task
        )
      );
    } catch (error) {
      // Update task status to failed
      setTasks(prev => 
        prev.map(task => 
          task.id === pendingTask.id 
            ? { 
                ...task, 
                status: 'failed' as const, 
                error: error instanceof Error ? error.message : 'Unknown error',
                updatedAt: new Date()
              }
            : task
        )
      );
    } finally {
      setIsProcessing(false);
      // Process next task if available
      processQueue();
    }
  }, [isProcessing, tasks]);

  const retryTask = useCallback((taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'pending', error: undefined, updatedAt: new Date() }
          : task
      )
    );
    processQueue();
  }, [processQueue]);

  const cancelTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  return {
    tasks,
    addTask,
    retryTask,
    cancelTask
  };
}
