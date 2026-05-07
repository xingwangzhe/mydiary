// 任务数据类型
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// 存储键名
const STORAGE_KEY = 'mydiary_tasks';

// 获取所有任务
export const getTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('读取任务数据失败:', error);
    return [];
  }
};

// 保存任务
export const saveTask = (task: Task): void => {
  try {
    const tasks = getTasks();
    const existingIndex = tasks.findIndex((t) => t.id === task.id);

    if (existingIndex >= 0) {
      // 更新现有任务
      tasks[existingIndex] = {
        ...task,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // 添加新任务
      tasks.push({
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('保存任务失败:', error);
  }
};

// 删除任务
export const deleteTask = (id: string): void => {
  try {
    const tasks = getTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('删除任务失败:', error);
  }
};

// 切换任务完成状态
export const toggleTaskCompletion = (id: string): void => {
  try {
    const tasks = getTasks();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          completed: !t.completed,
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('切换任务状态失败:', error);
  }
};

// 获取单个任务
export const getTaskById = (id: string): Task | null => {
  try {
    const tasks = getTasks();
    return tasks.find((t) => t.id === id) || null;
  } catch (error) {
    console.error('获取任务失败:', error);
    return null;
  }
};

// 初始化示例数据
export const initSampleTasks = (): void => {
  const tasks = getTasks();
  if (tasks.length === 0) {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: '完成日记软件开发',
        description: '实现所有核心功能，包括日记编辑、任务管理和账本功能',
        completed: false,
        priority: 'high',
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: '学习TypeScript',
        description: '深入学习TypeScript的高级特性',
        completed: false,
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: '锻炼身体',
        description: '每天坚持30分钟有氧运动',
        completed: true,
        priority: 'low',
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks));
  }
};
