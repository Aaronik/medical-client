import { ValueType } from 'react-select'

export type TOption = { value: string | number, label: string | HTMLElement }

const onSelectChange = (cb: Function) => (option: ValueType<TOption>) => {
  if (!option) return // this happens sometimes with this select I guess
  if (!option.hasOwnProperty('value')) return // I really don't understand when this would be the case either, the typing here is confusing me
  // @ts-ignore and here, it seems like TS does not understand the hasOwnProperty guard above
  cb(option.value)
}

export default onSelectChange
