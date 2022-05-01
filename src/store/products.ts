import { defineStore } from 'pinia'
import { ProductModel, storageKey } from '@/models/products/'
interface productsState {
  products: ProductModel[]
}
export const useProductsStore = defineStore('products', {
  state: () => {
    return <productsState>{
      products: []
    }
  },
  getters: {
    productsList ():ProductModel[] {
      return this.products
    },
    checkedAll ():boolean {
      return (
        this.products.length ? this.products.every(el => el.checked) : false
      )
    },
    total (): number {
      return (
        this.products.reduce((previousValue: number, currentValue: ProductModel): number => {
          return (currentValue.price * currentValue.qty) + previousValue
        }, 0)
      )
    }
  },
  actions: {
    add (payload: ProductModel):void {
      this.products.push(payload)
    },
    remove ():void {
      this.products = this.products.filter(el => !el.checked)
    },
    get ():void {
      const products: string | null = localStorage.getItem(storageKey)
      if (!products) return
      this.products = JSON.parse(products)
    },
    toggleCheck (payload: boolean, id: string):void {
      for (const item of this.products) {
        if (item.id === id) {
          item.checked = payload
          break
        }
      }
    },
    toggleCheckAll (payload: boolean):void {
      this.products.forEach(el => (el.checked = payload))
    }
  }
})
