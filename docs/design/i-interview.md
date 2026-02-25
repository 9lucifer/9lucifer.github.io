---
aside: false
---

# 面试突击

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const isAuthenticated = ref(false)
const passwordInput = ref('')
const errorMessage = ref('')
const inputRef = ref(null)

function checkPassword() {
  if (passwordInput.value === '050218') {
    isAuthenticated.value = true
    errorMessage.value = ''
    localStorage.setItem('i-interview-auth', 'authenticated')
  } else {
    errorMessage.value = '密码错误，请重试'
    passwordInput.value = ''
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    checkPassword()
  }
}

function lockContent() {
  isAuthenticated.value = false
  localStorage.removeItem('i-interview-auth')
  passwordInput.value = ''
  nextTick(() => {
    inputRef.value?.focus()
  })
}

onMounted(() => {
  const saved = localStorage.getItem('i-interview-auth')
  if (saved === 'authenticated') {
    isAuthenticated.value = true
  } else {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
})
</script>

<div v-if="!isAuthenticated" class="password-wrapper">
  <div class="password-card">
    <div class="password-icon">🔒</div>
    <h2>请输入访问密码</h2>
    <p class="password-hint">此页面需要密码才能访问</p>
    <input
      ref="inputRef"
      v-model="passwordInput"
      type="password"
      placeholder="输入密码..."
      @keyup="handleKeyPress"
      class="password-input"
    />
    <button @click="checkPassword" class="password-button">
      解锁访问
    </button>
    <p v-if="errorMessage" class="password-error">
      ❌ {{ errorMessage }}
    </p>
  </div>
</div>

<div v-else class="content-wrapper">
  <div class="unlock-bar">
    <span class="unlock-status">✅ 已解锁</span>
    <button @click="lockContent" class="lock-button">
      重新锁定
    </button>
  </div>

## javaSE

### 集合

#### 1. ArrayList

- ***为什么 new ArrayList<>（）时建议指定初始化容量值***
- ***为什么默认情况下的扩容机制是扩容为原数组的1.5倍***
- ***ArrayList是线程的安全吗***

#### 2. CopyOnWriteArrayList 的实现原理

#### 3. HashMap

- ***底层的数据结构***
- ***添加元素流程***
- ***扩容加载因子0.75***
- ***扩容为数组长度的2倍***
- ***HashMap是线程的安全吗***

#### 4. ConcurrentHashMap的实现原理



### 迭代器

#### 1. 实现原理

</content>

<style>
.password-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 20px;
}

.password-card {
  background: linear-gradient(145deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.04) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 100%;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.password-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.password-card h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.password-hint {
  margin: 0 0 24px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.password-input {
  width: 100%;
  padding: 14px 18px;
  font-size: 16px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--vp-c-text-1);
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.password-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px rgba(23, 171, 124, 0.15);
}

.password-button {
  width: 100%;
  margin-top: 16px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg,
    var(--vp-c-brand-1) 0%,
    var(--vp-c-brand-2) 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.password-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(23, 171, 124, 0.4);
}

.password-error {
  margin: 16px 0 0 0;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
}

.unlock-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  margin-bottom: 24px;
  background: linear-gradient(135deg,
    rgba(23, 171, 124, 0.15) 0%,
    rgba(23, 171, 124, 0.08) 100%);
  border: 1px solid rgba(23, 171, 124, 0.3);
  border-radius: 12px;
}

.unlock-status {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.lock-button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.lock-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--vp-c-text-1);
}

.content-wrapper {
  display: block;
}
</style>