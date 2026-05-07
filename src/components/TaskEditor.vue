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
        <button @click="saveTask" class="bg-primary-gradient text-on-primary px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors">
          保存
        </button>
      </div>
    </header>

    <!-- 编辑区域 -->
    <main class="pt-24 pb-12 max-w-4xl mx-auto">
      <!-- 标题输入 -->
      <div class="mb-8">
        <input 
          v-model="task.title" 
          type="text" 
          placeholder="输入任务标题..." 
          class="w-full text-3xl font-bold font-['Manrope'] text-on-surface bg-transparent border-none focus:outline-none"
        />
      </div>

      <!-- 任务详情 -->
      <div class="space-y-6 mb-8">
        <!-- 描述 -->
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']">描述</label>
          <textarea 
            v-model="task.description" 
            placeholder="输入任务描述..." 
            class="w-full min-h-[120px] text-body-md text-on-surface bg-surface-container-highest p-4 rounded-lg focus:bg-white focus:shadow-sm focus:outline-none transition-all resize-none font-['Inter']"
            rows="4"
          ></textarea>
        </div>

        <!-- 截止日期 -->
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']">截止日期</label>
          <input 
            v-model="task.dueDate" 
            type="date" 
            class="w-full text-body-md text-on-surface bg-surface-container-highest p-4 rounded-lg focus:bg-white focus:shadow-sm focus:outline-none transition-all font-['Inter']"
          />
        </div>

        <!-- 优先级 -->
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']">优先级</label>
          <div class="flex space-x-3">
            <button 
              :class="[
                'flex-1 py-3 rounded-lg font-medium transition-all',
                task.priority === 'low' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'
              ]"
              @click="task.priority = 'low'"
            >
              低
            </button>
            <button 
              :class="[
                'flex-1 py-3 rounded-lg font-medium transition-all',
                task.priority === 'medium' 
                  ? 'bg-yellow-100 text-yellow-700' 
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'
              ]"
              @click="task.priority = 'medium'"
            >
              中
            </button>
            <button 
              :class="[
                'flex-1 py-3 rounded-lg font-medium transition-all',
                task.priority === 'high' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'
              ]"
              @click="task.priority = 'high'"
            >
              高
            </button>
          </div>
        </div>

        <!-- 完成状态 -->
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-on-surface/80 font-['Inter']">完成状态</label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              v-model="task.completed" 
              type="checkbox" 
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="bg-primary-container/20 border-l-4 border-primary p-4 rounded">
        <p class="text-sm text-on-surface font-['Inter']">
          💡 提示：合理设置任务优先级和截止日期，有助于提高工作效率。
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../utils/taskStorage'

// Props
const props = defineProps<{
  task?: Task
}>()

// Emits
const emit = defineEmits<{
  (e: 'save', task: Task): void
  (e: 'cancel'): void
}>()

// 状态
const task = ref<Task>({
  id: props.task?.id || Date.now().toString(),
  title: props.task?.title || '',
  description: props.task?.description || '',
  completed: props.task?.completed || false,
  priority: props.task?.priority || 'medium',
  dueDate: props.task?.dueDate || new Date().toISOString().split('T')[0],
  createdAt: props.task?.createdAt || new Date().toISOString(),
  updatedAt: props.task?.updatedAt || new Date().toISOString()
})

// 方法
const saveTask = () => {
  if (!task.value.title.trim()) {
    alert('请输入任务标题')
    return
  }
  emit('save', task.value)
}

const goBack = () => {
  emit('cancel')
}
</script>
