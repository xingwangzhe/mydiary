<template>
  <div class="min-h-screen bg-surface p-8">
    <!-- 顶部导航 -->
    <header
      class="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
    >
      <div class="flex items-center space-x-4">
        <button
          @click="goBack"
          class="p-2 rounded-full hover:bg-surface-container transition-colors"
        >
          <span class="material-symbols-outlined text-on-surface">arrow_back</span>
        </button>
        <h1 class="text-2xl font-bold text-primary font-['Manrope']">MyDiary</h1>
      </div>
      <div class="flex items-center space-x-4">
        <button
          @click="saveLedger"
          class="bg-primary-gradient text-on-primary px-6 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          保存
        </button>
      </div>
    </header>

    <!-- 编辑区域 -->
    <main class="pt-24 pb-12 max-w-4xl mx-auto">
      <!-- 标题输入 -->
      <div class="mb-8">
        <input
          v-model="ledger.title"
          type="text"
          placeholder="输入记账标题..."
          class="w-full text-3xl font-bold font-['Manrope'] text-on-surface bg-transparent border-none focus:outline-none"
        />
      </div>

      <!-- 记账详情 -->
      <div class="space-y-6 mb-8">
        <!-- 金额 -->
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']"
            >金额</label
          >
          <input
            v-model.number="ledger.amount"
            type="number"
            placeholder="输入金额..."
            class="w-full text-body-md text-on-surface bg-surface-container-highest p-4 rounded-lg focus:bg-white focus:shadow-sm focus:outline-none transition-all font-['Inter']"
          />
        </div>

        <!-- 类型 -->
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']"
            >类型</label
          >
          <div class="flex space-x-3">
            <button
              :class="[
                'flex-1 py-3 rounded-lg font-medium transition-all',
                ledger.type === 'income'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container',
              ]"
              @click="ledger.type = 'income'"
            >
              收入
            </button>
            <button
              :class="[
                'flex-1 py-3 rounded-lg font-medium transition-all',
                ledger.type === 'expense'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container',
              ]"
              @click="ledger.type = 'expense'"
            >
              支出
            </button>
          </div>
        </div>

        <!-- 分类 -->
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']"
            >分类</label
          >
          <select
            v-model="ledger.category"
            class="w-full text-body-md text-on-surface bg-surface-container-highest p-4 rounded-lg focus:bg-white focus:shadow-sm focus:outline-none transition-all font-['Inter']"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- 日期 -->
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']"
            >日期</label
          >
          <input
            v-model="ledger.date"
            type="date"
            class="w-full text-body-md text-on-surface bg-surface-container-highest p-4 rounded-lg focus:bg-white focus:shadow-sm focus:outline-none transition-all font-['Inter']"
          />
        </div>

        <!-- 描述 -->
        <div>
          <label class="block text-sm font-medium text-on-surface/80 mb-2 font-['Inter']"
            >描述</label
          >
          <textarea
            v-model="ledger.description"
            placeholder="输入描述..."
            class="w-full min-h-[120px] text-body-md text-on-surface bg-surface-container-highest p-4 rounded-lg focus:bg-white focus:shadow-sm focus:outline-none transition-all resize-none font-['Inter']"
            rows="4"
          ></textarea>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="bg-primary-container/20 border-l-4 border-primary p-4 rounded">
        <p class="text-sm text-on-surface font-['Inter']">
          💡 提示：定期记录收支，有助于更好地管理个人财务。
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Ledger } from '../utils/ledgerStorage';

// Props
const props = defineProps<{
  ledger?: Ledger;
}>();

// Emits
const emit = defineEmits<{
  (e: 'save', ledger: Ledger): void;
  (e: 'cancel'): void;
}>();

// 分类选项
const categories = ['薪资', '日常消费', '娱乐', '交通', '医疗', '教育', '其他'];

// 状态
const ledger = ref<Ledger>({
  id: props.ledger?.id || Date.now().toString(),
  title: props.ledger?.title || '',
  amount: props.ledger?.amount || 0,
  type: props.ledger?.type || 'expense',
  category: props.ledger?.category || '日常消费',
  date: props.ledger?.date || new Date().toISOString().split('T')[0],
  description: props.ledger?.description || '',
  createdAt: props.ledger?.createdAt || new Date().toISOString(),
  updatedAt: props.ledger?.updatedAt || new Date().toISOString(),
});

// 方法
const saveLedger = () => {
  if (!ledger.value.title.trim()) {
    alert('请输入记账标题');
    return;
  }
  if (ledger.value.amount <= 0) {
    alert('请输入有效金额');
    return;
  }
  emit('save', ledger.value);
};

const goBack = () => {
  emit('cancel');
};
</script>
