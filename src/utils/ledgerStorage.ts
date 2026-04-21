// 账本数据类型
export interface Ledger {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  description: string
  createdAt: string
  updatedAt: string
}

// 存储键名
const STORAGE_KEY = 'mydiary_ledgers'

// 获取所有账本记录
export const getLedgers = (): Ledger[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('读取账本数据失败:', error)
    return []
  }
}

// 保存账本记录
export const saveLedger = (ledger: Ledger): void => {
  try {
    const ledgers = getLedgers()
    const existingIndex = ledgers.findIndex(l => l.id === ledger.id)
    
    if (existingIndex >= 0) {
      // 更新现有记录
      ledgers[existingIndex] = {
        ...ledger,
        updatedAt: new Date().toISOString()
      }
    } else {
      // 添加新记录
      ledgers.push({
        ...ledger,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ledgers))
  } catch (error) {
    console.error('保存账本记录失败:', error)
  }
}

// 删除账本记录
export const deleteLedger = (id: string): void => {
  try {
    const ledgers = getLedgers()
    const filtered = ledgers.filter(l => l.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('删除账本记录失败:', error)
  }
}

// 获取单个账本记录
export const getLedgerById = (id: string): Ledger | null => {
  try {
    const ledgers = getLedgers()
    return ledgers.find(l => l.id === id) || null
  } catch (error) {
    console.error('获取账本记录失败:', error)
    return null
  }
}

// 获取财务统计
export const getFinancialSummary = () => {
  const ledgers = getLedgers()
  
  const totalIncome = ledgers
    .filter(ledger => ledger.type === 'income')
    .reduce((sum, ledger) => sum + ledger.amount, 0)
  
  const totalExpense = ledgers
    .filter(ledger => ledger.type === 'expense')
    .reduce((sum, ledger) => sum + ledger.amount, 0)
  
  const balance = totalIncome - totalExpense
  
  // 按分类统计支出
  const expenseByCategory = ledgers
    .filter(ledger => ledger.type === 'expense')
    .reduce((acc, ledger) => {
      if (!acc[ledger.category]) {
        acc[ledger.category] = 0
      }
      acc[ledger.category] += ledger.amount
      return acc
    }, {} as Record<string, number>)
  
  // 按分类统计收入
  const incomeByCategory = ledgers
    .filter(ledger => ledger.type === 'income')
    .reduce((acc, ledger) => {
      if (!acc[ledger.category]) {
        acc[ledger.category] = 0
      }
      acc[ledger.category] += ledger.amount
      return acc
    }, {} as Record<string, number>)
  
  return {
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    incomeByCategory
  }
}

// 初始化示例数据
export const initSampleLedgers = (): void => {
  const ledgers = getLedgers()
  if (ledgers.length === 0) {
    const sampleLedgers: Ledger[] = [
      {
        id: '1',
        title: '工资',
        amount: 8000,
        type: 'income',
        category: '薪资',
        date: new Date().toISOString().split('T')[0],
        description: '本月工资',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: '餐饮',
        amount: 500,
        type: 'expense',
        category: '日常消费',
        date: new Date().toISOString().split('T')[0],
        description: '本月餐饮支出',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: '交通',
        amount: 200,
        type: 'expense',
        category: '日常消费',
        date: new Date().toISOString().split('T')[0],
        description: '本月交通支出',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleLedgers))
  }
}
