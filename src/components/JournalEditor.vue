<template>
  <div class="min-h-screen bg-surface p-8">
    <!-- 顶部导航 -->
    <header class="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="p-2 rounded-full hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="text-2xl font-bold text-primary font-['Manrope']">MyDiary</h1>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="saveJournal" class="bg-primary-gradient text-on-primary px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors">
          保存
        </button>
      </div>
    </header>

    <!-- 编辑区域 -->
    <main class="pt-24 pb-12 max-w-4xl mx-auto">
      <!-- 标题输入 -->
      <div class="mb-8">
        <input 
          v-model="journal.title" 
          type="text" 
          placeholder="输入标题..." 
          class="w-full text-3xl font-bold font-['Manrope'] text-on-surface bg-transparent border-none focus:outline-none"
        />
        <div class="flex items-center space-x-4 mt-4 text-sm text-on-surface/60 font-['Inter']">
          <span>{{ currentDate }}</span>
          <span class="material-symbols-outlined text-sm">schedule</span>
          <span>{{ currentTime }}</span>
        </div>
      </div>

      <!-- 内容编辑 -->
      <div class="mb-8">
        <textarea 
          v-model="journal.content" 
          placeholder="开始记录你的想法..." 
          class="w-full min-h-[400px] text-body-md text-on-surface bg-transparent border-none focus:outline-none resize-none font-['Inter']"
          rows="10"
        ></textarea>
      </div>

      <!-- 标签和心情 -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']">心情</label>
          <div class="flex space-x-2">
            <button 
              v-for="mood in moods" 
              :key="mood"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                journal.mood === mood 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'
              ]"
              @click="journal.mood = mood"
            >
              {{ mood }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']">分类</label>
          <div class="flex space-x-2">
            <button 
              v-for="category in categories" 
              :key="category"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                journal.category === category 
                  ? 'bg-secondary text-white' 
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'
              ]"
              @click="journal.category = category"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="bg-primary-container/20 border-l-4 border-primary p-4 rounded">
        <p class="text-sm text-on-surface font-['Inter']">
          💡 提示：记录你的真实感受，这是属于你自己的精神家园。
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
const props = defineProps<{
  journal?: {
    id?: string
    title: string
    content: string
    mood: string
    category: string
    date: string
  }
}>()

// Emits
const emit = defineEmits<{
  (e: 'save', journal: any): void
  (e: 'cancel'): void
}>()

// 状态
const journal = ref({
  id: props.journal?.id || Date.now().toString(),
  title: props.journal?.title || '',
  content: props.journal?.content || '',
  mood: props.journal?.mood || '平静',
  category: props.journal?.category || '生活',
  date: props.journal?.date || new Date().toISOString().split('T')[0]
})

// 选项
const moods = ['开心', '平静', '充满希望', '专注', '思考']
const categories = ['生活', '工作', '学习', '健康', '其他']

// 当前日期和时间
const currentDate = computed(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${year}年${month}月${day}日 ${weekday}`
})

const currentTime = computed(() => {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
})

// 方法
const saveJournal = () => {
  if (!journal.value.title.trim()) {
    alert('请输入标题')
    return
  }
  if (!journal.value.content.trim()) {
    alert('请输入内容')
    return
  }
  emit('save', journal.value)
}

const goBack = () => {
  emit('cancel')
}
</script>
