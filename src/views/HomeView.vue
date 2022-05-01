<template>
  <div class="home container container-md">
    <h3 class="main-title title-1 text-left">Vue invoice calc</h3>
    <form
      @submit.prevent
      autocomplete="off"
      name="product-form"
      class="prodform"
    >
      <input
        class="field field-name field-small field-accent mr-15"
        type="text"
        v-model="name"
        placeholder="Product name"
      >
      <input
        class="field field-small field-accent mr-15"
        type="number"
        v-model="price"
        @change="onChangePrice($event)"
        placeholder="Price"
      >
      <input
        class="field field-small field-accent mr-15"
        type="number"
        @change="onChangeQty($event)"
        v-model.number="qty"
        placeholder="qty"
      >
      <button
        type="button"
        @click="addProduct"
        :disabled="!canAddProduct"
        class="btn btn-small btn-outline btn-accent"
      >Add</button>
    </form>
    <table
      cellpadding="0"
      cellspacing="0"
      class="prodlist br-6 reset-table w-100"
    >
      <thead class="prodlist-head">
        <tr>
          <th class="prodlist-el prodlist-selectall text-left p-1">
            <input
              @change="onChangeAll($event)"
              :disabled="!canCheckAll"
              :checked="checkedAll"
              class="checkbox"
              type="checkbox"
            >
          </th>
          <th class="prodlist-el prodlist-name text-left p-1">Product Name</th>
          <th class="prodlist-el prodlist-price text-left p-1">Price</th>
          <th class="prodlist-el prodlist-qty text-left p-1">Qty</th>
          <th class="prodlist-el prodlist-sum text-left p-1">Sum</th>
        </tr>
      </thead>
      <tbody class="prodlist-body">
        <tr
          v-for="item in productsList"
          :key="item.id"
        >
          <td class="prodlist-el text-left p-1">
            <input
              class="checkbox"
              type="checkbox"
              :checked="item.checked"
              @change="onChange($event, item.id)"
            >
          </td>
          <td class="prodlist-el text-left p-1">{{ item.name }}</td>
          <td class="prodlist-el text-left p-1">${{ currency(item.price) }}</td>
          <td class="prodlist-el text-left p-1">{{ item.qty }}</td>
          <td class="prodlist-el text-left p-1">${{ currency(calcSum(item.price, item.qty)) }}</td>
        </tr>
        <tr class="prodlist-last-row">
          <td>
            <button
              @click="remove"
              :disabled="canDelete"
              type="button"
              class="btn btn-small btn-outline btn-accent-bright"
            >delete</button>
          </td>
          <td colspan="2"></td>
          <td>Total: </td>
          <td>${{ currency(total) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useProductsStore } from '@/store/products'
import { ProductModel } from '@/models/products'
import { storeToRefs } from 'pinia'
import currency from '@/helpers/filters/currency'
import uuid from '@/helpers/uuid'

interface dataState {
  name: string,
  price: number,
  qty: number
}

export default defineComponent({
  name: 'HomeView',
  setup () {
    const store = useProductsStore()
    const { remove, add, get, toggleCheck, toggleCheckAll } = store
    const { productsList, checkedAll, total } = storeToRefs(store)
    return {
      productsList,
      checkedAll,
      total,
      toggleCheckAll,
      toggleCheck,
      currency,
      remove,
      add,
      get
    }
  },
  data () {
    return {
      name: '',
      price: 0,
      qty: 0
    } as dataState
  },
  computed: {
    canAddProduct ():boolean {
      return (!!this.name.length && this.price > 0 && this.qty >= 1)
    },
    canCheckAll ():boolean {
      return !!this.productsList.length
    },
    canDelete ():boolean {
      return !this.productsList.some(el => el.checked)
    }
  },
  methods: {
    onChange ($event: Event, id: string):void {
      const target = $event.target as HTMLInputElement
      this.toggleCheck(target.checked, id)
    },
    onChangeQty ($event: Event):void {
      const target = $event.target as HTMLInputElement
      const newVal = Math.trunc(+target.value.replace('-', ''))
      this.qty = newVal
    },
    onChangePrice ($event: Event):void {
      const target = $event.target as HTMLInputElement
      const newVal = target.value.replace('-', '')
      this.price = +newVal
    },
    onChangeAll ($event: Event):void {
      const target = $event.target as HTMLInputElement
      this.toggleCheckAll(target.checked)
    },
    addProduct ():void {
      if (!this.canAddProduct) return
      const payload: ProductModel = {
        name: this.name,
        price: this.price,
        qty: this.qty,
        checked: false,
        id: uuid()
      }
      this.add(payload)
      this.clearData()
    },
    clearData ():void {
      this.name = ''
      this.price = this.qty = 0
    },
    calcSum (price: number, qty: number):number {
      return price * qty
    }
  },
  mounted () {
    this.get()
  }
})
</script>

<style scoped lang="sass">
@import '../assets/styles/variables'
.prodform
  display: flex
  flex-wrap: wrap
.field
  margin-bottom: 20px
  &-name
    flex-grow: 2
.main-title
  color: $accent-color
  margin-bottom: 20px
  margin-top: 120px
.prodlist
  font-weight: 500
  &-el
    border-right: 2px solid transparentize($accent-color, .3)
    line-height: 1
    &:first-child
      border-left: 2px solid transparentize($accent-color, .3)
  &-selectall
    width: 50px
  &-name
    width: 50%
  &-price,
  &-sum
    width: 18%
  &-selectall
    width: 50px
  &-head
    background: transparentize($accent-color, .8)
    th
      border-top: 2px solid transparentize($accent-color, .3)
      &:first-child
        border-top-left-radius: 6px
      &:last-child
        border-top-right-radius: 6px
  &-body
    tr
      background: transparentize($accent-color, .9)
      &:nth-child(2n)
        background: transparentize($accent-color, .8)
      &.prodlist-last-row
        background: transparent
        border: none
        td
          border-top: 2px solid transparentize($accent-color, .3)
          padding: 20px
</style>
