<template>
  <div class="min-h-screen bg-surface" :class="{ 'dark': isDarkMode }">
    <!-- 主题切换按钮 -->
    <button 
      @click="toggleTheme"
      class="fixed top-4 right-4 p-2 rounded-full bg-surface-container shadow-md z-50"
      aria-label="切换主题"
    >
      <span class="material-symbols-outlined">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
    </button>
    
    <!-- 日记编辑页面 -->
    <JournalEditor 
      v-if="showEditor" 
      :journal="editingJournal"
      @save="handleSaveJournal"
      @cancel="showEditor = false"
    />
    
    <!-- 任务编辑页面 -->
    <TaskEditor 
      v-else-if="showTaskEditor" 
      :task="editingTask"
      @save="handleSaveTask"
      @cancel="showTaskEditor = false"
    />
    
    <!-- 账本编辑页面 -->
    <LedgerEditor 
      v-else-if="showLedgerEditor" 
      :ledger="editingLedger"
      @save="handleSaveLedger"
      @cancel="showLedgerEditor = false"
    />
    
    <!-- 主页面 -->
    <div v-else>
      <!-- 侧边导航栏 -->
      <aside class="h-full w-72 fixed left-0 top-0 bg-[#f5f3ef] dark:bg-stone-900 border-none flex flex-col p-6 space-y-8 z-50 overflow-y-auto">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-[#4a654e] dark:text-[#8ba88e] font-['Manrope']">Sanctuary</h1>
          <p class="font-['Inter'] text-sm text-stone-500 dark:text-stone-400 mt-1">The Curated Life</p>
        </div>
        <nav class="flex-1 space-y-1">
          <a 
            :class="[
              'flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 active:scale-[0.98]',
              activeNav === 'home' 
                ? 'text-[#4a654e] dark:text-[#8ba88e] font-semibold bg-white/50 dark:bg-stone-800/50' 
                : 'text-stone-500 dark:text-stone-400 hover:bg-white/30 dark:hover:bg-stone-800/30'
            ]"
            @click="handleNavClick('home')"
          >
            <span class="material-symbols-outlined">home</span>
            <span class="font-['Inter']">Home</span>
          </a>
          <a 
            :class="[
              'flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 active:scale-[0.98]',
              activeNav === 'tasks' 
                ? 'text-[#4a654e] dark:text-[#8ba88e] font-semibold bg-white/50 dark:bg-stone-800/50' 
                : 'text-stone-500 dark:text-stone-400 hover:bg-white/30 dark:hover:bg-stone-800/30'
            ]"
            @click="handleNavClick('tasks')"
          >
            <span class="material-symbols-outlined">check_circle</span>
            <span class="font-['Inter']">Tasks</span>
          </a>
          <a 
            :class="[
              'flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 active:scale-[0.98]',
              activeNav === 'journal' 
                ? 'text-[#4a654e] dark:text-[#8ba88e] font-semibold bg-white/50 dark:bg-stone-800/50' 
                : 'text-stone-500 dark:text-stone-400 hover:bg-white/30 dark:hover:bg-stone-800/30'
            ]"
            @click="handleNavClick('journal')"
          >
            <span class="material-symbols-outlined">menu_book</span>
            <span class="font-['Inter']">Journal</span>
          </a>
          <a 
            :class="[
              'flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 active:scale-[0.98]',
              activeNav === 'ledger' 
                ? 'text-[#4a654e] dark:text-[#8ba88e] font-semibold bg-white/50 dark:bg-stone-800/50' 
                : 'text-stone-500 dark:text-stone-400 hover:bg-white/30 dark:hover:bg-stone-800/30'
            ]"
            @click="handleNavClick('ledger')"
          >
            <span class="material-symbols-outlined">account_balance_wallet</span>
            <span class="font-['Inter']">Ledger</span>
          </a>
        </nav>
        <div class="pt-6 border-t border-outline-variant/10">
          <button class="w-full bg-primary-gradient text-on-primary rounded-full py-4 px-6 flex items-center justify-center gap-2 font-['Inter'] font-semibold active:scale-95 transition-transform" @click="handleNewJournal">
            <span class="material-symbols-outlined">add</span>
            New Entry
          </button>
        </div>
        <div class="flex items-center gap-4 mt-auto">
          <img 
            class="w-10 h-10 rounded-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyi1bYvIDx9lQOQ0Wk6q74fPgKI4RdhFovoWqtsuCwhCXMCqmGpJO6RIJ7yvmPTvJbOpHJP8NHumCVFFpI-9OehFrhEevaHsxEb0NhzR8yGees_53reoqvqzZy4B2bs_34znUMMEVrci9UuWIDaOuFGCaqONb-9AOYLCmGmR4WFTBUiLhiiguibS1PNt4ytK5ee5_PhXMEZnQ6S43iAdRtyDJCltudpt6NCQoonINsuNUGVJKLcPDmPU1vBFRJSQtSNS7KRT4Tgvg"
            alt="User profile portrait"
          />
          <div>
            <p class="text-sm font-bold font-['Manrope']">User profile portrait</p>
          </div>
        </div>
      </aside>
      
      <!-- 主内容区域 -->
      <main class="ml-72 min-h-screen">
        <!-- 顶部导航栏 -->
        <header class="sticky top-0 z-40 w-full bg-[#fbf9f5]/80 backdrop-blur-xl flex justify-between items-center px-12 py-8">
          <div class="flex items-center gap-4 bg-surface-container-highest/50 px-6 py-3 rounded-full w-96 group focus-within:bg-white transition-all duration-300">
            <span class="material-symbols-outlined text-stone-400 group-focus-within:text-primary">search</span>
            <input 
              class="bg-transparent border-none focus:ring-0 w-full text-sm font-['Inter']" 
              :placeholder="activeNav === 'tasks' ? '搜索任务...' : activeNav === 'ledger' ? '搜索记账...' : '搜索往日回忆...'"
              type="text"
            />
          </div>
          <div class="flex items-center gap-8">
            <div class="flex gap-6">
              <span class="material-symbols-outlined text-stone-400 cursor-pointer hover:opacity-70 transition-opacity active:opacity-50" @click="handleNotificationClick">notifications</span>
              <span class="material-symbols-outlined text-stone-400 cursor-pointer hover:opacity-70 transition-opacity active:opacity-50" @click="handleSettingsClick">settings</span>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-xs font-['Inter'] uppercase tracking-widest text-[#4a654e]">{{ activeNav === 'tasks' ? 'Task Management' : activeNav === 'ledger' ? 'Financial Overview' : 'Morning Reflection' }}</span>
              <span class="text-[10px] text-stone-400 font-['Inter']">{{ currentDate }}</span>
            </div>
          </div>
        </header>
        
        <!-- 内容区域 -->
        <div class="px-12 py-12 max-w-7xl mx-auto space-y-16">
          <!-- 英雄头部 -->
          <section class="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div class="space-y-4">
              <h2 class="text-[56px] leading-tight font-['Manrope'] font-light tracking-tight text-on-surface">{{ activeNav === 'tasks' ? '任务管理' : activeNav === 'ledger' ? '账本管理' : '精神家园' }}</h2>
              <p class="text-lg font-['Inter'] text-secondary font-light max-w-md opacity-80">
                {{ activeNav === 'tasks' ? '合理规划任务，提高工作效率，实现目标。' : activeNav === 'ledger' ? '记录每一笔收支，掌握财务状况，实现财务自由。' : '在这里，记录每一刻内心的宁静与思考。让生活在笔尖缓缓流淌，成就更好的自己。' }}
              </p>
            </div>
            <button 
              v-if="activeNav === 'tasks'"
              class="bg-primary-gradient text-on-primary rounded-full px-10 py-5 text-lg font-['Inter'] font-semibold editorial-shadow active:scale-95 transition-transform flex items-center gap-3"
              @click="handleNewTask"
            >
              <span class="material-symbols-outlined">add</span>
              新建任务
            </button>
            <button 
              v-else-if="activeNav === 'ledger'"
              class="bg-primary-gradient text-on-primary rounded-full px-10 py-5 text-lg font-['Inter'] font-semibold editorial-shadow active:scale-95 transition-transform flex items-center gap-3"
              @click="handleNewLedger"
            >
              <span class="material-symbols-outlined">add</span>
              新建记账
            </button>
            <button 
              v-else
              class="bg-primary-gradient text-on-primary rounded-full px-10 py-5 text-lg font-['Inter'] font-semibold editorial-shadow active:scale-95 transition-transform flex items-center gap-3"
              @click="handleStartNewChapter"
            >
              <span class="material-symbols-outlined">stylus</span>
              开启新篇章
            </button>
          </section>
          
          <!-- 网格内容 -->
          <div class="grid grid-cols-12 gap-8 items-start">
            <!-- 左侧：内容区域 -->
            <section class="col-span-12 lg:col-span-8 space-y-12">
              <!-- 任务列表 -->
              <div v-if="activeNav === 'tasks'" class="space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-['Manrope'] font-medium text-on-surface">任务列表</h3>
                  <div class="flex space-x-3">
                    <button 
                      @click="filterTasks = 'all'"
                      :class='[
                        "px-4 py-2 rounded-full text-sm font-[Inter] transition-all",
                        filterTasks === "all" 
                          ? "bg-primary text-white" 
                          : "bg-surface-container-highest text-on-surface hover:bg-surface-container"
                      ]'
                    >
                      全部
                    </button>
                    <button 
                      @click="filterTasks = 'active'"
                      :class='[
                        "px-4 py-2 rounded-full text-sm font-[Inter] transition-all",
                        filterTasks === "active" 
                          ? "bg-primary text-white" 
                          : "bg-surface-container-highest text-on-surface hover:bg-surface-container"
                      ]'
                    >
                      未完成
                    </button>
                    <button 
                      @click="filterTasks = 'completed'"
                      :class='[
                        "px-4 py-2 rounded-full text-sm font-[Inter] transition-all",
                        filterTasks === "completed" 
                          ? "bg-primary text-white" 
                          : "bg-surface-container-highest text-on-surface hover:bg-surface-container"
                      ]'
                    >
                      已完成
                    </button>
                  </div>
                </div>
                <div class="space-y-4">
                  <div 
                    v-for="task in filteredTasks" 
                    :key="task.id"
                    class="bg-surface-container-lowest rounded-xl p-6 editorial-shadow group cursor-pointer transition-all duration-300 hover:shadow-md"
                  >
                    <div class="flex items-start gap-4">
                      <label class="relative inline-flex items-center cursor-pointer pt-1">
                        <input 
                          :checked="task.completed" 
                          @change="handleToggleTask(task.id)"
                          type="checkbox" 
                          class="sr-only peer"
                        />
                        <div class="w-6 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                      <div class="flex-1 space-y-2">
                        <h4 class="text-lg font-['Manrope'] font-semibold text-on-surface" :class="{ 'line-through text-stone-400': task.completed }">{{ task.title }}</h4>
                        <p class="text-sm text-on-surface-variant font-['Inter']" :class="{ 'line-through text-stone-400': task.completed }">{{ task.description }}</p>
                        <div class="flex items-center gap-4 mt-2">
                          <span 
                            class="text-xs font-['Inter'] font-semibold px-3 py-1 rounded-full"
                            :class="{
                              'bg-red-100 text-red-700': task.priority === 'high',
                              'bg-yellow-100 text-yellow-700': task.priority === 'medium',
                              'bg-green-100 text-green-700': task.priority === 'low'
                            }"
                          >
                            {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}优先级
                          </span>
                          <span class="text-xs text-stone-400 font-['Inter']">截止：{{ formatDate(task.dueDate) }}</span>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button 
                          @click="handleEditTask(task)"
                          class="p-2 rounded-full hover:bg-surface-container transition-colors"
                        >
                          <span class="material-symbols-outlined text-stone-400 hover:text-primary transition-colors">edit</span>
                        </button>
                        <button 
                          @click="handleDeleteTask(task.id)"
                          class="p-2 rounded-full hover:bg-surface-container transition-colors"
                        >
                          <span class="material-symbols-outlined text-stone-400 hover:text-error transition-colors">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 账本页面 -->
              <div v-if="activeNav === 'ledger'" class="space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-['Manrope'] font-medium text-on-surface">账本管理</h3>
                  <button 
                    @click="handleNewLedger"
                    class="bg-primary-gradient text-on-primary rounded-full px-6 py-3 text-sm font-['Inter'] font-semibold editorial-shadow active:scale-95 transition-transform flex items-center gap-2"
                  >
                    <span class="material-symbols-outlined">add</span>
                    新建记账
                  </button>
                </div>
                
                <!-- 财务统计卡片 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="bg-surface-container-low rounded-2xl p-6 editorial-shadow">
                    <h4 class="text-sm font-['Inter'] text-on-surface-variant mb-2">总收入</h4>
                    <p class="text-2xl font-['Manrope'] font-bold text-green-600">¥{{ financialSummary.totalIncome.toFixed(2) }}</p>
                  </div>
                  <div class="bg-surface-container-low rounded-2xl p-6 editorial-shadow">
                    <h4 class="text-sm font-['Inter'] text-on-surface-variant mb-2">总支出</h4>
                    <p class="text-2xl font-['Manrope'] font-bold text-red-600">¥{{ financialSummary.totalExpense.toFixed(2) }}</p>
                  </div>
                  <div class="bg-surface-container-low rounded-2xl p-6 editorial-shadow">
                    <h4 class="text-sm font-['Inter'] text-on-surface-variant mb-2">结余</h4>
                    <p :class='["text-2xl font-[Manrope] font-bold", financialSummary.balance >= 0 ? "text-green-600" : "text-red-600"]'>
                      ¥{{ financialSummary.balance.toFixed(2) }}
                    </p>
                  </div>
                </div>
                
                <!-- 记账记录列表 -->
                <div class="space-y-4">
                  <div 
                    v-for="ledger in ledgers" 
                    :key="ledger.id"
                    class="bg-surface-container-lowest rounded-xl p-6 editorial-shadow group cursor-pointer transition-all duration-300 hover:shadow-md"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1 space-y-2">
                        <h4 class="text-lg font-['Manrope'] font-semibold text-on-surface">{{ ledger.title }}</h4>
                        <div class="flex items-center gap-4">
                          <span class="text-xs font-['Inter'] font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{{ ledger.category }}</span>
                          <span class="text-xs text-stone-400 font-['Inter']">{{ formatDate(ledger.date) }}</span>
                        </div>
                        <p class="text-sm text-on-surface-variant font-['Inter']">{{ ledger.description }}</p>
                      </div>
                      <div class="flex flex-col items-end justify-between">
                        <p :class='["text-lg font-[Manrope] font-bold", ledger.type === "income" ? "text-green-600" : "text-red-600"]'>
                          {{ ledger.type === 'income' ? '+' : '-' }}¥{{ ledger.amount.toFixed(2) }}
                        </p>
                        <div class="flex space-x-2 mt-4">
                          <button 
                            @click="handleEditLedger(ledger)"
                            class="p-2 rounded-full hover:bg-surface-container transition-colors"
                          >
                            <span class="material-symbols-outlined text-stone-400 hover:text-primary transition-colors">edit</span>
                          </button>
                          <button 
                            @click="handleDeleteLedger(ledger.id)"
                            class="p-2 rounded-full hover:bg-surface-container transition-colors"
                          >
                            <span class="material-symbols-outlined text-stone-400 hover:text-error transition-colors">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 日记列表 -->
              <div v-else-if="activeNav === 'journal'" class="space-y-8">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-['Manrope'] font-medium text-on-surface">往日回忆</h3>
                  <span class="text-xs font-['Inter'] uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1 cursor-pointer hover:text-primary" @click="handleViewAllJournals">查看全部日志</span>
                </div>
                <div class="space-y-8">
                  <article 
                    v-for="journal in journals" 
                    :key="journal.id"
                    class="bg-surface-container-lowest rounded-xl p-8 editorial-shadow group cursor-pointer transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row gap-8"
                  >
                    <div class="w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                      <img 
                        class="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu_Z4Iz0nDVKsB1wqSXN5eNC97Mdnmt03rEB4GMgsnv4yxwTrIG8Y3ovwgolavv8PYwbanAbwKgNQEy_mrkvNCapilkHuY8cUh_6EfrKtrJWApFLMukHRO8pJeKNUQNllKVvM6rTyWao3krDn2tk2qmwLBPyh8trEgZNA1yB7FxurAOn_wUec-SXNssZ_QjTHXEUW_u0IAin58mxYnXvB8zNktbWIYYFmkoDwj-RA3AZ5oCn3lAk33hBxVTj8i-4KEbwVKrHMCY-I"
                        alt="日记封面"
                      />
                    </div>
                    <div class="flex-1 space-y-3">
                      <div class="flex items-center gap-3">
                        <span class="text-xs font-['Inter'] font-semibold bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full">{{ journal.mood }}</span>
                        <time class="text-sm text-stone-400 font-['Inter']">{{ formatDate(journal.date) }}</time>
                      </div>
                      <h4 class="text-xl font-['Manrope'] font-semibold text-on-surface">{{ journal.title }}</h4>
                      <p class="text-on-surface-variant font-['Inter'] line-clamp-2 leading-relaxed">
                        {{ journal.content }}
                      </p>
                    </div>
                    <div class="flex flex-col items-end justify-between">
                      <span class="material-symbols-outlined text-primary-container group-hover:text-primary transition-colors">sentiment_satisfied</span>
                      <div class="flex space-x-2">
                        <button 
                          @click="handleEditJournal(journal)"
                          class="p-2 rounded-full hover:bg-surface-container transition-colors"
                        >
                          <span class="material-symbols-outlined text-stone-400 hover:text-primary transition-colors">edit</span>
                        </button>
                        <button 
                          @click="handleDeleteJournal(journal.id)"
                          class="p-2 rounded-full hover:bg-surface-container transition-colors"
                        >
                          <span class="material-symbols-outlined text-stone-400 hover:text-error transition-colors">delete</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
              
              <!-- 首页内容 -->
              <div v-else class="space-y-8">
                <div class="flex items-center justify-between">
                  <h3 class="text-2xl font-['Manrope'] font-medium text-on-surface">往日回忆</h3>
                  <span class="text-xs font-['Inter'] uppercase tracking-widest text-stone-400 border-b border-stone-200 pb-1 cursor-pointer hover:text-primary" @click="handleViewAllJournals">查看全部日志</span>
                </div>
                <div class="space-y-8">
                  <article 
                    v-for="journal in journals.slice(0, 2)" 
                    :key="journal.id"
                    class="bg-surface-container-lowest rounded-xl p-8 editorial-shadow group cursor-pointer transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row gap-8"
                  >
                    <div class="w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                      <img 
                        class="w-full h-full object-cover" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu_Z4Iz0nDVKsB1wqSXN5eNC97Mdnmt03rEB4GMgsnv4yxwTrIG8Y3ovwgolavv8PYwbanAbwKgNQEy_mrkvNCapilkHuY8cUh_6EfrKtrJWApFLMukHRO8pJeKNUQNllKVvM6rTyWao3krDn2tk2qmwLBPyh8trEgZNA1yB7FxurAOn_wUec-SXNssZ_QjTHXEUW_u0IAin58mxYnXvB8zNktbWIYYFmkoDwj-RA3AZ5oCn3lAk33hBxVTj8i-4KEbwVKrHMCY-I"
                        alt="日记封面"
                      />
                    </div>
                    <div class="flex-1 space-y-3">
                      <div class="flex items-center gap-3">
                        <span class="text-xs font-['Inter'] font-semibold bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full">{{ journal.mood }}</span>
                        <time class="text-sm text-stone-400 font-['Inter']">{{ formatDate(journal.date) }}</time>
                      </div>
                      <h4 class="text-xl font-['Manrope'] font-semibold text-on-surface">{{ journal.title }}</h4>
                      <p class="text-on-surface-variant font-['Inter'] line-clamp-2 leading-relaxed">
                        {{ journal.content }}
                      </p>
                    </div>
                    <div class="flex flex-col items-end justify-between">
                      <span class="material-symbols-outlined text-primary-container group-hover:text-primary transition-colors">sentiment_satisfied</span>
                      <div class="flex space-x-2">
                        <button 
                          @click="handleEditJournal(journal)"
                          class="p-2 rounded-full hover:bg-surface-container transition-colors"
                        >
                          <span class="material-symbols-outlined text-stone-400 hover:text-primary transition-colors">edit</span>
                        </button>
                        <button 
                          @click="handleDeleteJournal(journal.id)"
                          class="p-2 rounded-full hover:bg-surface-container transition-colors"
                        >
                          <span class="material-symbols-outlined text-stone-400 hover:text-error transition-colors">delete</span>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>
            
            <!-- 右侧：统计与心情 -->
            <aside class="col-span-12 lg:col-span-4 space-y-8">
              <!-- 任务统计 -->
              <div v-if="activeNav === 'tasks'" class="bg-surface-container-low rounded-2xl p-8 space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-['Manrope'] font-semibold">任务统计</h3>
                  <span class="material-symbols-outlined text-primary">insights</span>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-['Inter'] text-on-surface-variant">总任务数</span>
                    <span class="text-lg font-['Manrope'] font-semibold">{{ tasks.length }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-['Inter'] text-on-surface-variant">已完成</span>
                    <span class="text-lg font-['Manrope'] font-semibold">{{ completedTasksCount }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-['Inter'] text-on-surface-variant">未完成</span>
                    <span class="text-lg font-['Manrope'] font-semibold">{{ activeTasksCount }}</span>
                  </div>
                  <div class="w-full bg-surface-container-highest rounded-full h-2 mt-4">
                    <div 
                      class="bg-primary-gradient h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${completionPercentage}%` }"
                    ></div>
                  </div>
                  <p class="text-sm font-['Inter'] text-on-surface-variant text-center">
                    完成率：{{ completionPercentage }}%
                  </p>
                </div>
              </div>
              
              <!-- 财务统计 -->
              <div v-if="activeNav === 'ledger'" class="bg-surface-container-low rounded-2xl p-8 space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-['Manrope'] font-semibold">财务统计</h3>
                  <span class="material-symbols-outlined text-primary">insights</span>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-['Inter'] text-on-surface-variant">总收入</span>
                    <span class="text-lg font-['Manrope'] font-semibold text-green-600">¥{{ financialSummary.totalIncome.toFixed(2) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-['Inter'] text-on-surface-variant">总支出</span>
                    <span class="text-lg font-['Manrope'] font-semibold text-red-600">¥{{ financialSummary.totalExpense.toFixed(2) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-['Inter'] text-on-surface-variant">结余</span>
                    <span :class='["text-lg font-[Manrope] font-semibold", financialSummary.balance >= 0 ? "text-green-600" : "text-red-600"]'>
                      ¥{{ financialSummary.balance.toFixed(2) }}
                    </span>
                  </div>
                  <div class="w-full bg-surface-container-highest rounded-full h-2 mt-4">
                    <div 
                      class="bg-primary-gradient h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${financialSummary.totalIncome > 0 ? (financialSummary.balance / financialSummary.totalIncome) * 100 : 0}%` }"
                    ></div>
                  </div>
                  <p class="text-sm font-['Inter'] text-on-surface-variant text-center">
                    结余率：{{ financialSummary.totalIncome > 0 ? ((financialSummary.balance / financialSummary.totalIncome) * 100).toFixed(1) : 0 }}%
                  </p>
                </div>
              </div>
              
              <!-- 今日心情图表 -->
              <div v-else-if="activeNav === 'journal' || activeNav === 'home'" class="bg-surface-container-low rounded-2xl p-8 space-y-6">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-['Manrope'] font-semibold">今日心情</h3>
                  <span class="material-symbols-outlined text-primary">insights</span>
                </div>
                <div class="flex items-end justify-between h-32 gap-3 px-2">
                  <div class="flex-1 bg-primary/20 rounded-t-lg relative group h-[40%]">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-white text-[10px] py-1 px-2 rounded">40%</div>
                  </div>
                  <div class="flex-1 bg-primary/40 rounded-t-lg relative group h-[60%]">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-white text-[10px] py-1 px-2 rounded">60%</div>
                  </div>
                  <div class="flex-1 bg-primary-gradient rounded-t-lg relative group h-[90%]">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-white text-[10px] py-1 px-2 rounded">90%</div>
                  </div>
                  <div class="flex-1 bg-primary/60 rounded-t-lg relative group h-[55%]">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-white text-[10px] py-1 px-2 rounded">55%</div>
                  </div>
                  <div class="flex-1 bg-primary/30 rounded-t-lg relative group h-[35%]">
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-on-surface text-white text-[10px] py-1 px-2 rounded">35%</div>
                  </div>
                </div>
                <div class="flex justify-between text-[10px] text-stone-400 font-['Inter'] px-2">
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>24:00</span>
                </div>
                <p class="text-sm font-['Inter'] text-on-surface-variant italic border-l-2 border-primary-container pl-4 py-1">
                  "波动起伏是生命的常态，正如潮汐。"
                </p>
              </div>
              
              <!-- 习惯追踪 -->
              <div class="bg-secondary-container/30 rounded-2xl p-8 space-y-6">
                <h3 class="text-lg font-['Manrope'] font-semibold">{{ activeNav === 'tasks' ? '任务趋势' : '记录习惯' }}</h3>
                <div v-if="activeNav === 'tasks'" class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-['Inter'] text-on-surface-variant">本周完成</span>
                    <span class="text-lg font-['Manrope'] font-semibold">{{ weeklyCompletedTasks }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-['Inter'] text-on-surface-variant">待办任务</span>
                    <span class="text-lg font-['Manrope'] font-semibold">{{ activeTasksCount }}</span>
                  </div>
                  <div class="w-full bg-surface-container-highest rounded-full h-2 mt-4">
                    <div class="bg-green-500 h-2 rounded-full transition-all duration-500" style="width: 65%"></div>
                  </div>
                </div>
                <div v-else class="grid grid-cols-4 gap-4">
                  <div class="aspect-square rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xs">一</div>
                  <div class="aspect-square rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xs">二</div>
                  <div class="aspect-square rounded-full bg-primary-gradient text-white flex items-center justify-center font-bold text-xs">三</div>
                  <div class="aspect-square rounded-full bg-primary-gradient text-white flex items-center justify-center font-bold text-xs">四</div>
                  <div class="aspect-square rounded-full bg-primary-gradient text-white flex items-center justify-center font-bold text-xs">五</div>
                  <div class="aspect-square rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xs">六</div>
                  <div class="aspect-square rounded-full border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xs">日</div>
                </div>
                <div class="flex items-center gap-3 pt-4">
                  <div class="flex -space-x-2">
                    <img class="w-6 h-6 rounded-full border-2 border-background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdBpiT_NjbBfLY0sajrDMo8PyElM8qfOyHQDr9KVIpo2RNWfe5ruhNfUEfiAE9-hsDT2-svkXD1c6UodpXHbznuXDDqyAAT7jK6Fo0kvsFWLsQbMfhGDD5VivOWTD5tmPqiCt8is14R6ab1Rvz87xiajD4qZ57GEQXOzW_PviMumzX2qX_ZDBV1QFh3tvmLxUTIefD0774saMAlUwlW65oMjFOrJUKplp_vMbbc2XrdGq-GzU_rn1xUX9AXc1X8TRqVDV16MXxB7w" alt="用户头像">
                    <img class="w-6 h-6 rounded-full border-2 border-background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3IFk9z9vnUaFpfGyi3m7PjUkwf8y7QCZWcQGXISuogPNCAP_TXdwPpJHGzDYsXwcKiH64Gm2cahyNKsjL9TZZfglmvEiD3t44pN1Uq9JJoB_ninRHomH2QjFderrQpW2w5-J9oc5hgvkIdETVfZMXGIufgqCT1jfGCaty10CYNzpNwO7TXrkfhw1ExHU3XXBt3YKnAAvjmewyBfZh7QnCh3oKpOqgDWbNVACTONAHiDqGBG8tHKh-sb5wx49m-0waCQVO8S6W_PM" alt="用户头像">
                  </div>
                  <span class="text-xs text-stone-500 font-['Inter']">还有 3 位朋友也在坚持</span>
                </div>
              </div>
              
              <!-- 引用卡片 -->
              <div class="relative rounded-2xl overflow-hidden h-64 flex items-center justify-center p-8 text-center group">
                <img 
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN_05Awnh-opHY62Oh_j3pGpafOKJH_v5K5cmOZyAz3ZxE0HsAFUM42aaV0CWPBqRex6hcnCQTugY4-LTbbsGkGjb50y-0y5fQEOdG7NzpCU68YHa2tRDuOM-YFPHe_uj7GU3ugr1WOpFkiAwBhZ8ED0StcyofZrQHAQlwe8OR6R70EEF-vRpJsFMCVOB4mbKC8sWOlsAKqE-RPqAxQJCciWePUdXaO6lBY7vDUaQcqzcwo3dCXT-s6IRQYGaVN21S6SgThUejGlc"
                  alt="日落海景"
                />
                <div class="absolute inset-0 bg-black/40"></div>
                <div class="relative z-10 space-y-4">
                  <p class="text-white font-['Manrope'] italic text-lg leading-relaxed">
                    {{ activeNav === 'tasks' ? '"成功是由完成的小事堆砌而成的。"' : '"重要的不是治愈，而是带着伤痛活下去。"' }}
                  </p>
                  <cite class="text-white/60 text-xs font-['Inter'] uppercase tracking-widest">
                    {{ activeNav === 'tasks' ? '— 罗伯特·科利尔' : '— 阿尔贝·加缪' }}
                  </cite>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import JournalEditor from './components/JournalEditor.vue'
import TaskEditor from './components/TaskEditor.vue'
import LedgerEditor from './components/LedgerEditor.vue'
import { getJournals, saveJournal, deleteJournal, initSampleData, Journal } from './utils/journalStorage'
import { getTasks, saveTask, deleteTask, toggleTaskCompletion, initSampleTasks, Task } from './utils/taskStorage'
import { getLedgers, saveLedger, deleteLedger, initSampleLedgers, Ledger, getFinancialSummary } from './utils/ledgerStorage'

// 导航项
const activeNav = ref('home')

// 日记数据
const journals = ref<Journal[]>([])

// 日记编辑状态
const showEditor = ref(false)
const editingJournal = ref<Journal>({
  id: '',
  title: '',
  content: '',
  mood: '平静',
  category: '生活',
  date: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

// 任务数据
const tasks = ref<Task[]>([])
const filterTasks = ref<'all' | 'active' | 'completed'>('all')

// 任务编辑状态
const showTaskEditor = ref(false)
const editingTask = ref<Task>({
  id: '',
  title: '',
  description: '',
  completed: false,
  priority: 'medium',
  dueDate: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

// 账本数据
const ledgers = ref<Ledger[]>([])

// 账本编辑状态
const showLedgerEditor = ref(false)
const editingLedger = ref<Ledger>({
  id: '',
  title: '',
  amount: 0,
  type: 'expense',
  category: '日常消费',
  date: new Date().toISOString().split('T')[0],
  description: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

// 主题状态
const isDarkMode = ref(false)

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  // 这里可以添加本地存储，保存主题偏好
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// 当前日期
const currentDate = computed(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
})

// 任务统计
const completedTasksCount = computed(() => {
  return tasks.value.filter(task => task.completed).length
})

const activeTasksCount = computed(() => {
  return tasks.value.filter(task => !task.completed).length
})

const completionPercentage = computed(() => {
  if (tasks.value.length === 0) return 0
  return Math.round((completedTasksCount.value / tasks.value.length) * 100)
})

const weeklyCompletedTasks = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return tasks.value.filter(task => {
    const taskDate = new Date(task.updatedAt)
    return task.completed && taskDate >= oneWeekAgo
  }).length
})

// 过滤任务
const filteredTasks = computed(() => {
  switch (filterTasks.value) {
    case 'active':
      return tasks.value.filter(task => !task.completed)
    case 'completed':
      return tasks.value.filter(task => task.completed)
    default:
      return tasks.value
  }
})

// 财务统计
const financialSummary = computed(() => {
  return getFinancialSummary()
})

// 组件挂载时初始化数据
onMounted(() => {
  // 从本地存储加载主题偏好
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  }
  
  initSampleData()
  initSampleTasks()
  initSampleLedgers()
  loadJournals()
  loadTasks()
  loadLedgers()
})

// 加载日记数据
const loadJournals = () => {
  journals.value = getJournals()
}

// 加载任务数据
const loadTasks = () => {
  tasks.value = getTasks()
}

// 加载账本数据
const loadLedgers = () => {
  ledgers.value = getLedgers()
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${year}年${month}月${day}日 · ${weekday}`
}

// 按钮点击事件
const handleNavClick = (id: string) => {
  activeNav.value = id
  console.log('切换到:', id)
  // 这里可以添加页面切换逻辑
}

const handleNewJournal = () => {
  console.log('新建日记')
  editingJournal.value = {
    id: Date.now().toString(),
    title: '',
    content: '',
    mood: '平静',
    category: '生活',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  showEditor.value = true
}

const handleStartNewChapter = () => {
  console.log('开启新篇章')
  handleNewJournal()
}

const handleViewAllJournals = () => {
  console.log('查看全部日志')
  // 这里可以添加查看全部日志的逻辑
  alert('查看全部日志功能')
}

const handleNotificationClick = () => {
  console.log('通知')
  // 这里可以添加通知功能
  alert('通知功能')
}

const handleSettingsClick = () => {
  console.log('设置')
  // 这里可以添加设置功能
  alert('设置功能')
}

const handleSaveJournal = (journal: Journal) => {
  console.log('保存日记:', journal)
  saveJournal(journal)
  loadJournals()
  alert('日记保存成功！')
  showEditor.value = false
}

const handleDeleteJournal = (id: string) => {
  if (confirm('确定要删除这篇日记吗？')) {
    deleteJournal(id)
    loadJournals()
    alert('日记删除成功！')
  }
}

const handleEditJournal = (journal: Journal) => {
  editingJournal.value = { ...journal }
  showEditor.value = true
}

// 任务相关操作
const handleNewTask = () => {
  console.log('新建任务')
  editingTask.value = {
    id: Date.now().toString(),
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  showTaskEditor.value = true
}

const handleSaveTask = (task: Task) => {
  console.log('保存任务:', task)
  saveTask(task)
  loadTasks()
  alert('任务保存成功！')
  showTaskEditor.value = false
}

const handleDeleteTask = (id: string) => {
  if (confirm('确定要删除这个任务吗？')) {
    deleteTask(id)
    loadTasks()
    alert('任务删除成功！')
  }
}

const handleEditTask = (task: Task) => {
  editingTask.value = { ...task }
  showTaskEditor.value = true
}

const handleToggleTask = (id: string) => {
  toggleTaskCompletion(id)
  loadTasks()
}

// 账本相关操作
const handleNewLedger = () => {
  console.log('新建记账')
  editingLedger.value = {
    id: Date.now().toString(),
    title: '',
    amount: 0,
    type: 'expense',
    category: '日常消费',
    date: new Date().toISOString().split('T')[0],
    description: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  showLedgerEditor.value = true
}

const handleSaveLedger = (ledger: Ledger) => {
  console.log('保存记账:', ledger)
  saveLedger(ledger)
  loadLedgers()
  alert('记账保存成功！')
  showLedgerEditor.value = false
}

const handleDeleteLedger = (id: string) => {
  if (confirm('确定要删除这条记账记录吗？')) {
    deleteLedger(id)
    loadLedgers()
    alert('记账删除成功！')
  }
}

const handleEditLedger = (ledger: Ledger) => {
  editingLedger.value = { ...ledger }
  showLedgerEditor.value = true
}
</script>

<style scoped>
/* 深色模式样式 */
.dark {
  --bg-surface: #121212;
  --bg-surface-container: #1e1e1e;
  --bg-surface-container-low: #252525;
  --bg-surface-container-lowest: #2d2d2d;
  --bg-surface-container-highest: #3a3a3a;
  --bg-secondary-container: #2a2a2a;
  --text-on-surface: #ffffff;
  --text-on-surface-variant: #b0b0b0;
  --text-primary: #8ba88e;
  --bg-primary: #4a654e;
  --bg-primary-container: #8ba88e;
  --text-primary-fixed: #121212;
  --bg-primary-fixed: #cceace;
  --text-error: #f48fb1;
  --bg-error: #c62828;
  --bg-on-surface: #121212;
  --bg-primary-gradient: linear-gradient(135deg, #4a654e 0%, #8ba88e 100%);
}

/* 全局样式调整 */
.dark .bg-surface {
  background-color: var(--bg-surface);
}

.dark .bg-surface-container {
  background-color: var(--bg-surface-container);
}

.dark .bg-surface-container-low {
  background-color: var(--bg-surface-container-low);
}

.dark .bg-surface-container-lowest {
  background-color: var(--bg-surface-container-lowest);
}

.dark .bg-surface-container-highest {
  background-color: var(--bg-surface-container-highest);
}

.dark .bg-secondary-container {
  background-color: var(--bg-secondary-container);
}

.dark .text-on-surface {
  color: var(--text-on-surface);
}

.dark .text-on-surface-variant {
  color: var(--text-on-surface-variant);
}

.dark .text-primary {
  color: var(--text-primary);
}

.dark .bg-primary {
  background-color: var(--bg-primary);
}

.dark .bg-primary-container {
  background-color: var(--bg-primary-container);
}

.dark .text-primary-fixed {
  color: var(--text-primary-fixed);
}

.dark .bg-primary-fixed {
  background-color: var(--bg-primary-fixed);
}

.dark .text-error {
  color: var(--text-error);
}

.dark .bg-error {
  background-color: var(--bg-error);
}

.dark .bg-on-surface {
  background-color: var(--bg-on-surface);
}

.dark .editorial-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

/* 确保侧边导航栏在深色模式下的样式 */
.dark aside {
  background-color: var(--bg-surface-container);
  border-right: 1px solid var(--bg-surface-container-highest);
}

.dark h1, .dark h2, .dark h3, .dark h4 {
  color: var(--text-on-surface);
}

.dark p, .dark span {
  color: var(--text-on-surface-variant);
}

/* 按钮在深色模式下的样式 */
.dark button {
  transition: all 0.3s ease;
}

.dark button:hover {
  opacity: 0.9;
}

/* 卡片在深色模式下的样式 */
.dark .rounded-xl, .dark .rounded-2xl {
  background-color: var(--bg-surface-container-lowest);
  border: 1px solid var(--bg-surface-container-highest);
}

/* 输入框在深色模式下的样式 */
.dark input, .dark textarea, .dark select {
  background-color: var(--bg-surface-container);
  color: var(--text-on-surface);
  border: 1px solid var(--bg-surface-container-highest);
}

.dark input:focus, .dark textarea:focus, .dark select:focus {
  border-color: var(--bg-primary);
  outline: none;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* 卡片悬停效果增强 */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 按钮动画效果 */
.btn-animate {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-animate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-animate:active {
  transform: translateY(0);
}

/* 主题切换动画 */
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* 加载动画 */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4a654e;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 数字变化动画 */
.number-animate {
  transition: all 0.5s ease;
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 深色模式滚动条 */
.dark ::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.dark ::-webkit-scrollbar-thumb {
  background: #555;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>