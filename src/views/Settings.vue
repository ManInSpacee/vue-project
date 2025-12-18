<template>
  <div class="settings">
    <h1>Продвинутые функции</h1>
    
    <nav class="tabs">
      <router-link to="/settings/generation" :class="{ active: $route.params.tab === 'generation' }" class="tab">Генерация</router-link>
      <router-link to="/settings/analysis" :class="{ active: $route.params.tab === 'analysis' }" class="tab">Анализ</router-link>
      <router-link to="/settings/library" :class="{ active: $route.params.tab === 'library' }" class="tab">Библиотека</router-link>
      <router-link to="/settings/export" :class="{ active: $route.params.tab === 'export' }" class="tab">Экспорт</router-link>
    </nav>
    
    <div class="panel">
      <!-- Продвинутая генерация -->
      <div v-if="$route.params.tab === 'generation'">
        <h2>Продвинутая генерация</h2>
        
        <div class="form-group">
          <label>Базовый цвет: </label>
          <input v-model="baseColor" type="color" style="width: 80px; height: 40px">
          <span>{{ baseColor }}</span>
        </div>
        
        <div class="form-group">
          <label>Тип палитры: </label>
          <select v-model="paletteType" style="padding: 5px; width: 200px">
            <option value="analogous">Аналогичная</option>
            <option value="monochrome">Монохромная</option>
            <option value="triad">Триада</option>
            <option value="complementary">Комплементарная</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Настроение: </label>
          <select v-model="mood" style="padding: 5px; width: 200px">
            <option value="calm">Спокойные</option>
            <option value="energetic">Энергичные</option>
            <option value="professional">Профессиональные</option>
          </select>
        </div>
        
        <button @click="generateAdvanced" class="btn-primary">Сгенерировать палитру</button>
        
        <div v-if="generatedPalette.length > 0" class="palette-result">
          <h3>Результат:</h3>
          <div class="palette-strip">
            <div v-for="(color, i) in generatedPalette" :key="i" class="color-card">
              <div class="color-preview" :style="{ backgroundColor: color }"></div>
              <div class="color-value">{{ color }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Анализ и доступность -->
      <div v-else-if="$route.params.tab === 'analysis'">
        <h2>Анализ и доступность</h2>
        
        <div class="form-group">
          <label>Цвет 1: </label>
          <input v-model="color1" type="color" style="width: 80px; height: 40px">
          <input v-model="color1" type="text" style="width: 100px; padding: 5px">
        </div>
        
        <div class="form-group">
          <label>Цвет 2: </label>
          <input v-model="color2" type="color" style="width: 80px; height: 40px">
          <input v-model="color2" type="text" style="width: 100px; padding: 5px">
        </div>
        
        <button @click="checkContrast" class="btn-primary">Проверить контрастность</button>
        
        <div v-if="contrastResult" class="contrast-result">
          <h3>Результат проверки WCAG 2.1:</h3>
          <div class="contrast-level" :class="contrastResult.passesAA ? 'pass' : 'fail'">
            <strong>Соотношение контраста: {{ contrastResult.ratio }}:1</strong>
            <p><strong>Уровень: {{ contrastResult.level }}</strong></p>
            <div class="wcag-details">
              <p><strong>WCAG AA:</strong></p>
              <ul>
                <li>Обычный текст (4.5:1): {{ contrastResult.aaNormal ? '✅ Проходит' : '❌ Не проходит' }}</li>
                <li>Крупный текст/UI (3:1): {{ contrastResult.aaLarge ? '✅ Проходит' : '❌ Не проходит' }}</li>
              </ul>
              <p><strong>WCAG AAA:</strong></p>
              <ul>
                <li>Обычный текст (7:1): {{ contrastResult.aaaNormal ? '✅ Проходит' : '❌ Не проходит' }}</li>
                <li>Крупный текст (4.5:1): {{ contrastResult.aaaLarge ? '✅ Проходит' : '❌ Не проходит' }}</li>
              </ul>
            </div>
          </div>
          
          <!-- Визуальный превью текста на фоне -->
          <div class="contrast-preview">
            <h4>Визуальный превью:</h4>
            <div class="preview-grid">
              <div class="preview-item">
                <div class="preview-label">Обычный текст</div>
                <div class="text-preview" :style="{ backgroundColor: color1, color: color2 }">
                  <p style="font-size: 16px; padding: 20px; margin: 0;">
                    Это пример обычного текста на фоне. Контрастность должна быть не менее 4.5:1 для WCAG AA.
                  </p>
                </div>
              </div>
              <div class="preview-item">
                <div class="preview-label">Крупный текст</div>
                <div class="text-preview" :style="{ backgroundColor: color1, color: color2 }">
                  <p style="font-size: 24px; padding: 20px; margin: 0; font-weight: bold;">
                    Это пример крупного текста. Контрастность должна быть не менее 3:1 для WCAG AA.
                  </p>
                </div>
              </div>
              <div class="preview-item">
                <div class="preview-label">Инвертированные цвета</div>
                <div class="text-preview" :style="{ backgroundColor: color2, color: color1 }">
                  <p style="font-size: 16px; padding: 20px; margin: 0;">
                    Это пример текста с инвертированными цветами. Проверьте, какой вариант лучше читается.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Подбор акцентных цветов -->
        <div class="accent-colors-section">
          <h3>Подбор акцентных цветов</h3>
          <div class="form-group">
            <label>Базовая палитра: </label>
            <input v-model="basePaletteInput" type="text" placeholder="#FF6B6B, #4ECDC4, #45B7D1" style="padding: 5px; width: 300px">
            <button @click="generateAccentColors" class="btn-primary">Подобрать акценты</button>
          </div>
          <div v-if="accentColors.length > 0" class="accent-result">
            <h4>Подобранные акцентные цвета:</h4>
            <div class="palette-strip">
              <div v-for="(color, i) in accentColors" :key="i" class="color-card">
                <div class="color-preview" :style="{ backgroundColor: color }"></div>
                <div class="color-value">{{ color }}</div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Библиотека палитр -->
      <div v-else-if="$route.params.tab === 'library'">
        <h2>Библиотека палитр</h2>
        
        <!-- Форма сохранения -->
        <div class="save-form">
          <h3>Сохранить палитру</h3>
          <div class="form-group">
            <label>Название палитры: </label>
            <input v-model="paletteName" type="text" style="padding: 5px; width: 200px" placeholder="Моя палитра">
          </div>
          <div class="form-group">
            <label>Теги (через запятую): </label>
            <input v-model="paletteTags" type="text" style="padding: 5px; width: 300px" placeholder="веб, интерфейс, яркие">
          </div>
          <button @click="saveToLibrary" class="btn-primary">Сохранить</button>
        </div>
        
        <!-- Фильтры и поиск -->
        <div class="library-filters">
          <div class="form-group">
            <label>Поиск: </label>
            <input v-model="searchQuery" type="text" style="padding: 5px; width: 200px" placeholder="Поиск по названию или тегам...">
          </div>
          <div class="form-group">
            <label>Фильтр: </label>
            <button @click="filterFavorites = !filterFavorites" :class="{ active: filterFavorites }" class="filter-btn">
              {{ filterFavorites ? '⭐ Избранные' : '⭐ Все' }}
            </button>
            <button @click="showAllTags" class="filter-btn">Все теги</button>
          </div>
          <div v-if="allTags.length > 0" class="tags-filter">
            <label>Теги: </label>
            <button 
              v-for="tag in allTags" 
              :key="tag"
              @click="toggleTagFilter(tag)"
              :class="{ active: selectedTags.includes(tag) }"
              class="tag-btn"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        
        <!-- Список палитр -->
        <div class="library-list">
          <div v-for="palette in filteredLibrary" :key="palette.id" class="library-item" :class="{ favorite: palette.favorite }">
            <div class="library-header">
              <div class="library-title">
                <button @click="toggleFavorite(palette.id)" class="favorite-btn" :title="palette.favorite ? 'Убрать из избранного' : 'Добавить в избранное'">
                  {{ palette.favorite ? '⭐' : '☆' }}
                </button>
                <h4>{{ palette.name }}</h4>
              </div>
              <div class="library-actions">
                <button @click="loadPalette(palette)" class="btn-small">Загрузить</button>
                <button @click="editPalette(palette)" class="btn-small">Редактировать</button>
                <button @click="deletePalette(palette.id)" class="btn-small">Удалить</button>
              </div>
            </div>
            <div v-if="palette.tags && palette.tags.length > 0" class="library-tags">
              <span v-for="tag in palette.tags" :key="tag" class="tag-badge">{{ tag }}</span>
            </div>
            <div class="palette-strip">
              <div v-for="(color, i) in palette.colors" :key="i" class="color-mini" :style="{ backgroundColor: color }">
                {{ color }}
              </div>
            </div>
          </div>
          <div v-if="filteredLibrary.length === 0" class="empty-library">
            <p>Палитры не найдены</p>
          </div>
        </div>
      </div>
      
      <!-- Экспорт -->
      <div v-else-if="$route.params.tab === 'export'">
        <h2>Экспорт и интеграция</h2>
        
        <div class="form-group">
          <label>Формат экспорта: </label>
          <select v-model="exportFormat" style="padding: 5px; width: 200px">
            <option value="css">CSS Variables</option>
            <option value="scss">SCSS Variables</option>
            <option value="tailwind">Tailwind Config</option>
          </select>
        </div>
        
        <button @click="generateExport" class="btn-primary">Сгенерировать код</button>
        
        <div v-if="exportCode" class="export-result">
          <h3>Код:</h3>
          <pre><code>{{ exportCode }}</code></pre>
          <button @click="copyExport" class="btn-primary">Копировать</button>
        </div>
        
        <div class="preview-ui">
          <h3>Превью в UI-компонентах</h3>
          <div class="ui-preview">
            <div class="ui-button" :style="{ backgroundColor: previewColors[0] }">Кнопка</div>
            <div class="ui-card" :style="{ borderColor: previewColors[1] }">Карточка</div>
            <div class="ui-badge" :style="{ backgroundColor: previewColors[2] }">Бейдж</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const baseColor = ref('#FF6B6B')
const paletteType = ref('analogous')
const mood = ref('calm')
const generatedPalette = ref([])

const color1 = ref('#000000')
const color2 = ref('#FFFFFF')
const contrastResult = ref(null)
const basePaletteInput = ref('')
const accentColors = ref([])
const color1Hue = ref(null)
const color2Hue = ref(null)

const paletteName = ref('')
const paletteTags = ref('')
const searchQuery = ref('')
const library = ref([])
const filterFavorites = ref(false)
const selectedTags = ref([])

const exportFormat = ref('css')
const exportCode = ref('')
const previewColors = ref(['#FF6B6B', '#4ECDC4', '#45B7D1'])

// Продвинутая генерация
const generateAdvanced = () => {
  const colors = []
  const base = hexToHsl(baseColor.value)
  
  let hues = []
  if (paletteType.value === 'analogous') {
    hues = [base.h - 30, base.h, base.h + 30, base.h + 60, base.h + 90]
  } else if (paletteType.value === 'monochrome') {
    hues = [base.h, base.h, base.h, base.h, base.h]
  } else if (paletteType.value === 'triad') {
    hues = [base.h, base.h + 120, base.h + 240, base.h + 60, base.h + 180]
  } else if (paletteType.value === 'complementary') {
    hues = [base.h, base.h + 180, base.h + 90, base.h + 270, base.h + 45]
  }
  
  hues.forEach(h => {
    let s = base.s
    let l = base.l
    
    if (mood.value === 'calm') {
      s = Math.max(20, s - 20)
      l = Math.min(70, l + 10)
    } else if (mood.value === 'energetic') {
      s = Math.min(100, s + 20)
      l = Math.max(30, l - 10)
    } else if (mood.value === 'professional') {
      s = Math.max(10, s - 30)
      l = 50
    }
    
    colors.push(hslToHex((h + 360) % 360, s, l))
  })
  
  generatedPalette.value = colors
}

const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 }
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

// Проверка контрастности по WCAG 2.1
const getLuminance = (hex) => {
  // Конвертация HEX в RGB (0-255)
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  // Нормализация RGB значений (0-1)
  const normalize = (val) => val / 255
  
  // Применение гамма-коррекции
  const gammaCorrect = (val) => {
    const normalized = normalize(val)
    return normalized <= 0.03928 
      ? normalized / 12.92 
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  }
  
  // Относительная яркость по формуле WCAG
  return 0.2126 * gammaCorrect(r) + 
         0.7152 * gammaCorrect(g) + 
         0.0722 * gammaCorrect(b)
}

const checkContrast = () => {
  const l1 = getLuminance(color1.value)
  const l2 = getLuminance(color2.value)
  
  // Контрастное соотношение (более светлый / более темный)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  const ratio = (lighter + 0.05) / (darker + 0.05)
  
  // WCAG 2.1 стандарты:
  // AA: обычный текст 4.5:1, крупный текст 3:1, UI компоненты 3:1
  // AAA: обычный текст 7:1, крупный текст 4.5:1
  const aaNormal = ratio >= 4.5
  const aaLarge = ratio >= 3.0
  const aaUI = ratio >= 3.0
  const aaaNormal = ratio >= 7.0
  const aaaLarge = ratio >= 4.5
  
  let level = 'Недостаточно'
  if (aaaNormal) level = 'AAA (обычный текст)'
  else if (aaNormal) level = 'AA (обычный текст)'
  else if (aaLarge) level = 'AA (крупный текст/UI)'
  
  contrastResult.value = {
    ratio: ratio.toFixed(2),
    aaNormal,
    aaLarge,
    aaUI,
    aaaNormal,
    aaaLarge,
    level,
    passesAA: aaNormal || aaLarge,
    passesAAA: aaaNormal || aaaLarge
  }
  
  // Обновляем hue для цветового круга
  color1Hue.value = hexToHsl(color1.value).h
  color2Hue.value = hexToHsl(color2.value).h
}

// Подбор акцентных цветов
const generateAccentColors = () => {
  const colors = basePaletteInput.value.split(',').map(c => c.trim()).filter(c => c.match(/^#[0-9A-Fa-f]{6}$/i))
  if (colors.length === 0) {
    alert('Введите корректные HEX цвета через запятую')
    return
  }
  
  const accents = []
  colors.forEach(baseColor => {
    const hsl = hexToHsl(baseColor)
    // Генерируем комплементарный цвет
    const compHue = (hsl.h + 180) % 360
    accents.push(hslToHex(compHue, Math.min(100, hsl.s + 20), Math.max(20, hsl.l - 20)))
    // Генерируем триадный цвет
    const triadHue = (hsl.h + 120) % 360
    accents.push(hslToHex(triadHue, hsl.s, hsl.l))
    // Генерируем аналогичный цвет
    const analogHue = (hsl.h + 30) % 360
    accents.push(hslToHex(analogHue, hsl.s, Math.min(80, hsl.l + 10)))
  })
  
  accentColors.value = accents.slice(0, 6) // Ограничиваем до 6 цветов
}


// Библиотека
const saveToLibrary = () => {
  if (!paletteName.value) {
    alert('Введите название палитры')
    return
  }
  
  const tags = paletteTags.value.split(',').map(t => t.trim()).filter(t => t.length > 0)
  
  const palette = {
    id: editingPaletteId.value || Date.now(),
    name: paletteName.value,
    tags: tags,
    favorite: editingPaletteId.value ? library.value.find(p => p.id === editingPaletteId.value)?.favorite || false : false,
    colors: generatedPalette.value.length > 0 ? generatedPalette.value : ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  }
  
  if (editingPaletteId.value) {
    // Редактирование существующей палитры
    const index = library.value.findIndex(p => p.id === editingPaletteId.value)
    if (index !== -1) {
      library.value[index] = palette
    }
    editingPaletteId.value = null
  } else {
    // Добавление новой палитры
    library.value.push(palette)
  }
  
  localStorage.setItem('paletteLibrary', JSON.stringify(library.value))
  paletteName.value = ''
  paletteTags.value = ''
  alert('Палитра сохранена!')
}

const editingPaletteId = ref(null)

const loadPalette = (palette) => {
  router.push('/palette')
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('loadPalette', { detail: palette.colors }))
  }, 100)
}

const editPalette = (palette) => {
  paletteName.value = palette.name
  paletteTags.value = palette.tags ? palette.tags.join(', ') : ''
  generatedPalette.value = palette.colors
  editingPaletteId.value = palette.id
}

const deletePalette = (id) => {
  if (confirm('Удалить палитру?')) {
    library.value = library.value.filter(p => p.id !== id)
    localStorage.setItem('paletteLibrary', JSON.stringify(library.value))
  }
}

const toggleFavorite = (id) => {
  const palette = library.value.find(p => p.id === id)
  if (palette) {
    palette.favorite = !palette.favorite
    localStorage.setItem('paletteLibrary', JSON.stringify(library.value))
  }
}

const toggleTagFilter = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const allTags = computed(() => {
  const tags = new Set()
  library.value.forEach(p => {
    if (p.tags && Array.isArray(p.tags)) {
      p.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
})

const showAllTags = () => {
  selectedTags.value = []
}

const filteredLibrary = computed(() => {
  let result = library.value
  
  // Фильтр по избранным
  if (filterFavorites.value) {
    result = result.filter(p => p.favorite)
  }
  
  // Поиск по названию и тегам
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }
  
  // Фильтр по выбранным тегам
  if (selectedTags.value.length > 0) {
    result = result.filter(p => 
      p.tags && p.tags.some(tag => selectedTags.value.includes(tag))
    )
  }
  
  return result
})

// Экспорт
const generateExport = () => {
  const colors = generatedPalette.value.length > 0 ? generatedPalette.value : ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
  
  if (exportFormat.value === 'css') {
    exportCode.value = ':root {\n' + colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n') + '\n}'
  } else if (exportFormat.value === 'scss') {
    exportCode.value = '$colors: (\n' + colors.map((c, i) => `  color-${i + 1}: ${c}`).join(',\n') + '\n);'
  } else if (exportFormat.value === 'tailwind') {
    exportCode.value = 'module.exports = {\n  theme: {\n    extend: {\n      colors: {\n' + colors.map((c, i) => `        color${i + 1}: '${c}'`).join(',\n') + '\n      }\n    }\n  }\n}'
  }
}

const copyExport = async () => {
  try {
    await navigator.clipboard.writeText(exportCode.value)
    alert('Код скопирован!')
  } catch (err) {
    alert('Ошибка копирования')
  }
}

// Загрузка библиотеки
const loadLibrary = () => {
  const saved = localStorage.getItem('paletteLibrary')
  if (saved) {
    try {
      library.value = JSON.parse(saved)
    } catch (e) {
      library.value = []
    }
  }
}

// Слушаем событие загрузки палитры
watch(() => router.currentRoute.value.params.tab, () => {
  if (router.currentRoute.value.params.tab === 'library') {
    loadLibrary()
  }
})

loadLibrary()
</script>

<style scoped>
.settings {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab {
  padding: 10px 20px;
  border: 1px solid #ccc;
  text-decoration: none;
  color: inherit;
  background: white;
}

.tab.active {
  background: #42b883;
  color: white;
}

.panel {
  border: 1px solid #ccc;
  padding: 20px;
  background: white;
}

.form-group {
  margin: 15px 0;
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
}

.btn-primary:hover {
  background: #35a372;
}

.btn-small {
  padding: 5px 10px;
  margin: 0 5px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  cursor: pointer;
}

.palette-strip {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.color-card {
  flex: 1;
  min-width: 120px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
}

.color-preview {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  margin-bottom: 5px;
}

.color-value {
  font-family: monospace;
  font-size: 12px;
  text-align: center;
}

.contrast-result {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.contrast-level.pass {
  background: #d4edda;
  color: #155724;
  border: 2px solid #28a745;
}

.contrast-level.fail {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #dc3545;
}

.wcag-details {
  margin-top: 15px;
}

.wcag-details ul {
  margin: 10px 0;
  padding-left: 20px;
}

.wcag-details li {
  margin: 5px 0;
}


.contrast-preview {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.contrast-preview h4 {
  margin: 0 0 15px 0;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.preview-item {
  background: white;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.preview-label {
  padding: 10px;
  background: #e0e0e0;
  font-weight: bold;
  font-size: 14px;
}

.text-preview {
  min-height: 100px;
  border-radius: 0 0 4px 4px;
}

.accent-colors-section {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
}

.accent-result {
  margin-top: 20px;
}

.library-list {
  margin-top: 20px;
}

.library-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  background: white;
}

.library-item.favorite {
  border-color: #ffd700;
  border-width: 2px;
  background: #fffef0;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.library-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.library-actions {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.library-tags {
  margin-bottom: 10px;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag-badge {
  background: #e0e0e0;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #333;
}

.save-form {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
  background: #f9f9f9;
}

.library-filters {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
}

.filter-btn {
  padding: 5px 15px;
  margin: 0 5px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.filter-btn.active {
  background: #42b883;
  color: white;
}

.tags-filter {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.tag-btn {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 12px;
  font-size: 12px;
}

.tag-btn.active {
  background: #42b883;
  color: white;
}

.empty-library {
  text-align: center;
  padding: 40px;
  color: #999;
}

.color-mini {
  width: 60px;
  height: 60px;
  display: inline-block;
  margin: 5px;
  border-radius: 4px;
  font-size: 10px;
  color: white;
  text-shadow: 0 0 2px black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-result {
  margin-top: 20px;
}

.export-result pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

.ui-preview {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.ui-button,
.ui-card,
.ui-badge {
  padding: 15px 30px;
  border-radius: 4px;
  color: white;
}

.ui-card {
  border: 2px solid;
  background: white;
  color: #333;
}

@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }
  
  .tab {
    width: 100%;
  }
}
</style>
