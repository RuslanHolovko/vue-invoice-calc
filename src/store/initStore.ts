import { createPinia } from 'pinia'
import { productsSub } from '@/store/subscribes'
export const pinia = createPinia()
pinia.use(productsSub)
