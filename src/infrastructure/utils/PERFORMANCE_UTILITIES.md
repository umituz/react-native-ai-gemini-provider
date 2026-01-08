# Performance Utilities

Performans izleme ve optimizasyon araçları. Operasyon sürelerini ölçmek, debouncing ve throttling yapmak için kullanılır.

## Dosya

[`performance.util.ts`](./performance.util.ts)

## Fonksiyonlar

### `measureAsync(operation, metadata?)`

Asenkron operasyonun süresini ölçer.

**Parametreler:**
- `operation`: `() => Promise<T>` - Ölçülecek operasyon
- `metadata?`: `Record<string, unknown>` - Ek metadata (opsiyonel)

**Dönen değer:** `Promise<{ result: T; duration: number }>`

**Örnek:**

```typescript
import { measureAsync } from '@umituz/react-native-ai-gemini-provider';

const { result, duration } = await measureAsync(
  async () => {
    return await fetch('https://api.example.com/data');
  },
  { operation: 'fetch-data' }
);

console.log(`Sonuç:`, result);
console.log(`Süre: ${duration}ms`);
```

### `measureSync(operation, metadata?)`

Senkron operasyonun süresini ölçer.

**Parametreler:**
- `operation`: `() => T` - Ölçülecek operasyon
- `metadata?`: `Record<string, unknown>` - Ek metadata (opsiyonel)

**Dönen değer:** `{ result: T; duration: number }`

**Örnek:**

```typescript
import { measureSync } from '@umituz/react-native-ai-gemini-provider';

const { result, duration } = measureSync(
  () => {
    return expensiveCalculation();
  },
  { operation: 'calculation' }
);

console.log(`Sonuç: ${result}, Süre: ${duration}ms`);
```

### `debounce(func, wait)`

Debounce fonksiyonu oluşturur. Fonksiyon çağrıları arasındaki bekleme süresini kontrol eder.

**Parametreler:**
- `func`: `T` - Debounce edilecek fonksiyon
- `wait`: `number` - Bekleme süresi (ms)

**Dönen değer:** Debounce edilmiş fonksiyon

**Örnek:**

```typescript
import { debounce } from '@umituz/react-native-ai-gemini-provider';

const debouncedSearch = debounce((query: string) => {
  console.log('Aranıyor:', query);
}, 300);

debouncedSearch('test');  // 300ms bekler
debouncedSearch('test2'); // Önceki iptal olur, 300ms bekler
// 300ms sonra: 'Aranıyor: test2'
```

### `throttle(func, limit)`

Throttle fonksiyonu oluşturur. Fonksiyonun maksimum çağrılma sıklığını sınırlar.

**Parametreler:**
- `func`: `T` - Throttle edilecek fonksiyon
- `limit`: `number` - Minimum çağrılma aralığı (ms)

**Dönen değer:** Throttle edilmiş fonksiyon

**Örnek:**

```typescript
import { throttle } from '@umituz/react-native-ai-gemini-provider';

const throttledScroll = throttle(() => {
  console.log('Scroll olayı');
}, 100);

// Her 100ms'de en fazla bir kez çalışır
window.addEventListener('scroll', throttledScroll);
```

## Sınıflar

### PerformanceTimer

Performans zamanlayıcısı.

```typescript
class PerformanceTimer {
  constructor(metadata?: Record<string, unknown>)

  stop(): number
  get duration: number
  getMetrics(): PerformanceMetrics
  get isRunning(): boolean
}
```

#### Kullanım

```typescript
import { PerformanceTimer } from '@umituz/react-native-ai-gemini-provider';

const timer = new PerformanceTimer({ operation: 'data-processing' });

// İşlem yap
processData();

const duration = timer.stop();
console.log(`Süre: ${duration}ms`);
console.log(`Çalışıyor mu? ${timer.isRunning}`); // false
```

### PerformanceTracker

Performans takipçisi. Birden fazla operasyonun istatistiklerini tutar.

```typescript
class PerformanceTracker {
  record(operation: string, duration: number): void
  getStats(operation: string): Stats | null
  getAllStats(): Record<string, Stats>
  clear(): void
}

interface Stats {
  count: number;
  avg: number;
  min: number;
  max: number;
}
```

#### Kullanım

```typescript
import { performanceTracker } from '@umituz/react-native-ai-gemini-provider';

// Operasyon sürelerini kaydet
performanceTracker.record('api-call', 150);
performanceTracker.record('api-call', 200);
performanceTracker.record('api-call', 175);

// İstatistikleri al
const stats = performanceTracker.getStats('api-call');
console.log(stats);
// { count: 3, avg: 175, min: 150, max: 200 }

// Tüm istatistikleri al
const allStats = performanceTracker.getAllStats();
console.log(allStats);
// { 'api-call': { count: 3, avg: 175, min: 150, max: 200 } }

// Temizle
performanceTracker.clear();
```

## Global Instance

```typescript
export const performanceTracker = new PerformanceTracker();
```

## Kullanım Örnekleri

### API Çağrısı Ölçümü

```typescript
import { measureAsync, performanceTracker } from '@umituz/react-native-ai-gemini-provider';

async function fetchUserData(userId: string) {
  const { result, duration } = await measureAsync(
    () => fetch(`/api/users/${userId}`).then(r => r.json()),
    { operation: 'fetch-user', userId }
  );

  // Performans tracker'a kaydet
  performanceTracker.record('fetch-user', duration);

  return result;
}
```

### Batch İşlem Performansı

```typescript
import { measureSync } from '@umituz/react-native-ai-gemini-provider';

function processBatch(items: any[]) {
  const { result, duration } = measureSync(
    () => items.map(item => processItem(item)),
    { operation: 'batch-process', itemCount: items.length }
  );

  console.log(`${items.length} öğe ${duration}ms'de işlendi`);
  console.log(`Ortalama: ${(duration / items.length).toFixed(2)}ms per item`);

  return result;
}
```

### Arama Input'u Debounce

```typescript
import { debounce } from '@umituz/react-native-ai-gemini-provider';

function SearchInput() {
  const [query, setQuery] = useState('');

  // Debounce ile arama
  const debouncedSearch = debounce(async (searchQuery: string) => {
    const results = await searchAPI(searchQuery);
    setResults(results);
  }, 500);

  const handleChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <TextInput
      value={query}
      onChangeText={handleChange}
      placeholder="Ara..."
    />
  );
}
```

### Scroll Olayı Throttle

```typescript
import { throttle } from '@umituz/react-native-ai-gemini-provider';

function InfiniteScrollList() {
  const handleScroll = throttle(() => {
    // Scroll sonuna yaklaştıkça daha fazla veri yükle
    loadMoreData();
  }, 500);

  return (
    <ScrollView onScroll={handleScroll}>
      {/* İçerik */}
    </ScrollView>
  );
}
```

### Kompleks Operasyon Takibi

```typescript
import { PerformanceTimer } from '@umituz/react-native-ai-gemini-provider';

async function complexOperation() {
  const timers = {
    step1: new PerformanceTimer({ step: 'step1' }),
    step2: new PerformanceTimer({ step: 'step2' }),
    step3: new PerformanceTimer({ step: 'step3' }),
  };

  // Adım 1
  const result1 = await step1();
  timers.step1.stop();
  console.log(`Adım 1: ${timers.step1.duration}ms`);

  // Adım 2
  const result2 = await step2();
  timers.step2.stop();
  console.log(`Adım 2: ${timers.step2.duration}ms`);

  // Adım 3
  const result3 = await step3();
  timers.step3.stop();
  console.log(`Adım 3: ${timers.step3.duration}ms`);

  const totalDuration = timers.step1.duration + timers.step2.duration + timers.step3.duration;
  console.log(`Toplam: ${totalDuration}ms`);
}
```

### Performance Dashboard

```typescript
import { performanceTracker } from '@umituz/react-native-ai-gemini-provider';

function PerformanceDashboard() {
  const stats = performanceTracker.getAllStats();

  return (
    <View>
      <Text>Performans İstatistikleri</Text>
      {Object.entries(stats).map(([operation, stat]) => (
        <View key={operation}>
          <Text>{operation}</Text>
          <Text>Count: {stat.count}</Text>
          <Text>Average: {stat.avg.toFixed(0)}ms</Text>
          <Text>Min: {stat.min}ms</Text>
          <Text>Max: {stat.max}ms</Text>
        </View>
      ))}
    </View>
  );
}
```

### Conditional Measurement

```typescript
import { measureAsync } from '@umituz/react-native-ai-gemini-provider';

async function conditionalFetch(shouldMeasure: boolean) {
  if (shouldMeasure) {
    // Development modunda ölç
    const { result, duration } = await measureAsync(
      () => fetch('https://api.example.com/data'),
      { operation: 'fetch-data' }
    );

    if (__DEV__) {
      console.log(`API call took ${duration}ms`);
    }

    return result;
  } else {
    // Production'da direkt çağır
    return await fetch('https://api.example.com/data');
  }
}
```

### Memory Monitoring

```typescript
import { measureAsync } from '@umituz/react-native-ai-gemini-provider';

async function monitoredOperation() {
  const startMemory = performance.memory?.usedJSHeapSize;

  const { result, duration } = await measureAsync(async () => {
    return await heavyOperation();
  });

  const endMemory = performance.memory?.usedJSHeapSize;
  const memoryUsed = endMemory && startMemory
    ? endMemory - startMemory
    : 0;

  console.log(`Süre: ${duration}ms`);
  console.log(`Memory: ${(memoryUsed / 1024 / 1024).toFixed(2)}MB`);

  return result;
}
```

### Performance Alerts

```typescript
import { performanceTracker } from '@umituz/react-native-ai-gemini-provider';

// Performance monitoring
setInterval(() => {
  const stats = performanceTracker.getAllStats();

  Object.entries(stats).forEach(([operation, stat]) => {
    // Yavaş operasyon kontrolü
    if (stat.avg > 5000) {
      console.warn(`⚠️ Yavaş operasyon: ${operation} (avg: ${stat.avg.toFixed(0)}ms)`);
      // Alert gönder
      sendAlert({
        type: 'slow-operation',
        operation,
        avgTime: stat.avg,
      });
    }

    // Çok değişken (min-max farkı büyük)
    const variance = stat.max - stat.min;
    if (variance > 3000) {
      console.warn(`⚠️ Dengesiz operasyon: ${operation} (min: ${stat.min}ms, max: ${stat.max}ms)`);
    }
  });
}, 60000); // Her dakika
```

## PerformanceMetrics

```typescript
interface PerformanceMetrics {
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}
```

## Best Practices

### 1. Measure kullanın

```typescript
// ✅ İyi - measureAsync kullan
const { result, duration } = await measureAsync(() => apiCall());

// ❌ Kötü - Manuel ölçüm
const start = Date.now();
const result = await apiCall();
const duration = Date.now() - start;
```

### 2. Metadata ekleyin

```typescript
// ✅ İyi - Metadata ile
measureAsync(() => apiCall(), {
  operation: 'fetch-user',
  userId: '123',
  endpoint: '/api/users/123'
});

// ❌ Kötü - Metadata olmadan
measureAsync(() => apiCall());
```

### 3. Debounce/throttle kullanın

```typescript
// ✅ İyi - Debounce ile
const debouncedSearch = debounce(search, 300);

// ❌ Kötü - Her tuşta arama
onChange={(e) => search(e.target.value)}
```

### 4. Development'da ölçün

```typescript
// ✅ İyi - Sadece development'ta
if (__DEV__) {
  const { duration } = await measureAsync(() => apiCall());
  console.log(`API call: ${duration}ms`);
}

// ❌ Kötü - Her zaman ölçüm
const { duration } = await measureAsync(() => apiCall());
```

## İlgili Dosyalar

- [`performance.util.ts`](./performance.util.ts) - Implementasyon
- [`../telemetry/README.md`](../telemetry/README.md) - Telemetry modülü
