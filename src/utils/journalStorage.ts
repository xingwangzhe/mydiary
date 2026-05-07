// 日记数据类型
export interface Journal {
  id: string;
  title: string;
  content: string;
  mood: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// 存储键名
const STORAGE_KEY = 'mydiary_journals';

// 获取所有日记
export const getJournals = (): Journal[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('读取日记数据失败:', error);
    return [];
  }
};

// 保存日记
export const saveJournal = (journal: Journal): void => {
  try {
    const journals = getJournals();
    const existingIndex = journals.findIndex((j) => j.id === journal.id);

    if (existingIndex >= 0) {
      // 更新现有日记
      journals[existingIndex] = {
        ...journal,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // 添加新日记
      journals.push({
        ...journal,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
  } catch (error) {
    console.error('保存日记失败:', error);
  }
};

// 删除日记
export const deleteJournal = (id: string): void => {
  try {
    const journals = getJournals();
    const filtered = journals.filter((j) => j.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('删除日记失败:', error);
  }
};

// 获取单个日记
export const getJournalById = (id: string): Journal | null => {
  try {
    const journals = getJournals();
    return journals.find((j) => j.id === id) || null;
  } catch (error) {
    console.error('获取日记失败:', error);
    return null;
  }
};

// 初始化示例数据
export const initSampleData = (): void => {
  const journals = getJournals();
  if (journals.length === 0) {
    const sampleJournals: Journal[] = [
      {
        id: '1',
        title: '清晨的远山与呼吸',
        content:
          '今天的雾气格外的重。站在露台上，我几乎看不清远处的松林。但这正是我需要的，一种被世界暂时隔离的静谧感。煮了一壶茶，茶香在空气中弥漫，与雾气交织在一起，仿佛置身于仙境。这样的早晨，让我重新感受到了生活的美好。',
        mood: '平静',
        category: '生活',
        date: '2023-10-22',
        createdAt: '2023-10-22T08:00:00.000Z',
        updatedAt: '2023-10-22T08:00:00.000Z',
      },
      {
        id: '2',
        title: '重拾身体的韵律',
        content:
          '很久没有进行深度拉伸了。每一个关节的舒展都伴随着微微的酸痛，但之后是前所未有的轻盈。专注力也随之回归，仿佛找回了与身体的连接。运动不仅是对身体的锻炼，更是对心灵的净化。',
        mood: '专注',
        category: '健康',
        date: '2023-10-20',
        createdAt: '2023-10-20T18:00:00.000Z',
        updatedAt: '2023-10-20T18:00:00.000Z',
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleJournals));
  }
};
