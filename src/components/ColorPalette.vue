<template>
  <div class="palette">
    <h1>Палитра цветов</h1>
    
    <!-- Генерация палитры -->
    <div class="controls">
      <button @click="generatePalette" class="btn-primary">Случайная палитра</button>
      <label>Количество цветов: </label>
      <select v-model="colorCount" style="padding: 5px; margin-right: 20px">
        <option :value="3">3</option>
        <option :value="5">5</option>
        <option :value="7">7</option>
      </select>
      <label>Формат: </label>
      <select v-model="colorFormat" style="padding: 5px">
        <option value="hex">HEX</option>
        <option value="rgb">RGB</option>
      </select>
    </div>

    <!-- Горизонтальная полоса цветовых карточек -->
    <div class="palette-strip">
      <div 
        v-for="(color, index) in currentPalette" 
        :key="index"
        class="color-card"
        :class="{ pinned: pinnedColors.includes(index) }"
        @click="copyToClipboard(color)"
      >
        <div class="color-preview" :style="{ backgroundColor: color }"></div>
        <div class="color-value">{{ formatColor(color) }}</div>
        <button @click.stop="togglePin(index)" class="pin-btn" :title="pinnedColors.includes(index) ? 'Открепить' : 'Закрепить'">
          {{ pinnedColors.includes(index) ? '📌' : '📍' }}
        </button>
      </div>
    </div>

    <!-- Уведомление о копировании -->
    <div v-if="copied" class="notification">Скопировано: {{ copiedColor }}</div>

    <!-- Превью в mockup интерфейса -->
    <div class="preview-section">
      <h2>Превью палитры</h2>
      <div class="preview-controls">
        <label>Фон: </label>
        <button @click="previewBg = 'light'" :class="{ active: previewBg === 'light' }">Светлый</button>
        <button @click="previewBg = 'dark'" :class="{ active: previewBg === 'dark' }">Тёмный</button>
      </div>
      <div class="mockup" :class="previewBg">
        <h3 class="mockup-title" :style="{ color: currentPalette[0] }">Заголовок</h3>
        <div class="mockup-card" :style="{ backgroundColor: currentPalette[1], color: currentPalette[0] }">
          Карточка с текстом
        </div>
        <button class="mockup-button" :style="{ backgroundColor: currentPalette[2], color: '#fff' }">
          Кнопка
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const colorCount = ref(5)
const colorFormat = ref('hex')
const currentPalette = ref([])
const pinnedColors = ref([])
const copied = ref(false)
const copiedColor = ref('')
const previewBg = ref('light')

// Генерация гармоничных цветов
const generatePalette = () => {
  const colors = []
  const baseHue = Math.random() * 360
  
  for (let i = 0; i < colorCount.value; i++) {
    if (pinnedColors.value.includes(i) && currentPalette.value[i]) {
      colors.push(currentPalette.value[i])
    } else {
      const hue = (baseHue + (i * 60 / colorCount.value)) % 360
      const saturation = 50 + Math.random() * 30
      const lightness = 40 + Math.random() * 30
      colors.push(hslToHex(hue, saturation, lightness))
    }
  }
  
  currentPalette.value = colors
  savePalette()
}

const hslToHex = (h, s, l) => {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }
  
  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('').toUpperCase()
}

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

const formatColor = (color) => {
  if (colorFormat.value === 'rgb') {
    return hexToRgb(color)
  }
  return color
}

const copyToClipboard = async (color) => {
  const text = formatColor(color)
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    copiedColor.value = text
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    alert('Ошибка копирования')
  }
}

const togglePin = (index) => {
  const idx = pinnedColors.value.indexOf(index)
  if (idx > -1) {
    pinnedColors.value.splice(idx, 1)
  } else {
    pinnedColors.value.push(index)
  }
  savePalette()
}

const savePalette = () => {
  localStorage.setItem('palette', JSON.stringify({
    colors: currentPalette.value,
    pinned: pinnedColors.value,
    count: colorCount.value,
    format: colorFormat.value
  }))
}

const loadPalette = () => {
  const saved = localStorage.getItem('palette')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      currentPalette.value = data.colors || []
      pinnedColors.value = data.pinned || []
      colorCount.value = data.count || 5
      colorFormat.value = data.format || 'hex'
    } catch (e) {
      generatePalette()
    }
  } else {
    generatePalette()
  }
}

onMounted(() => {
  loadPalette()
  
  // Слушаем событие загрузки палитры из библиотеки
  window.addEventListener('loadPalette', (event) => {
    if (event.detail && Array.isArray(event.detail)) {
      currentPalette.value = event.detail
      savePalette()
    }
  })
})
</script>

<style scoped>
.palette {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary:hover {
  background: #35a372;
}

.palette-strip {
  display: flex;
  gap: 15px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.color-card {
  flex: 1;
  min-width: 150px;
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  position: relative;
  background: white;
  transition: transform 0.2s;
}

.color-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.color-card.pinned {
  border-color: #42b883;
  border-width: 3px;
}

.color-preview {
  width: 100%;
  height: 100px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.color-value {
  font-family: monospace;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
}

.pin-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,255,255,0.8);
  border: none;
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
}

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #42b883;
  color: white;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 1000;
}

.preview-section {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.preview-controls {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-controls button {
  padding: 5px 15px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.preview-controls button.active {
  background: #42b883;
  color: white;
}

.mockup {
  padding: 30px;
  border-radius: 8px;
  min-height: 200px;
}

.mockup.light {
  background: #f5f5f5;
}

.mockup.dark {
  background: #1a1a1a;
}

.mockup-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.mockup-card {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.mockup-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

@media (max-width: 768px) {
  .palette-strip {
    flex-direction: column;
  }
  
  .color-card {
    min-width: 100%;
  }
}
</style>
