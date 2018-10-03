import React from 'react'
import { setStruct, setSchemaField } from './JSONSchema/FieldCreator'
import { Input, Select, Checkbox, InputNumber, Button } from 'antd'

const { Option } = Select;
const { TextArea: Textarea } = Input

const Label = props => {
  const { children } = props;
  return <p style={{ margin: "8px 0" }}>{children}</p>
}
const TextField = props => {
  const { label, value, onChange } = props;
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%" }} />
    </div>
  )
}

const TextArea = props => {
  const { label, value, onChange } = props;
  return (
    <div>
      <Label>{label}</Label>
      <Textarea rows={3} value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%" }} />
    </div>
  )
}


const NumberField = props => {
  const { label, value, onChange } = props;
  return (
    <div>
      <Label>{label}</Label>
      <InputNumber value={value} style={{ width: "100%" }} onChange={e => onChange(e || "")} />
    </div>
  )
}

const CheckBox = props => {
  const { label, value, onChange, ...rest } = props;
  return (
    <div style={{ margin: "8px 0" }}>
      <Checkbox onChange={e => onChange(e.target.checked)}>{label}</Checkbox>
    </div>
  )
}

const Selectfield = props => {
  const { label, options, defaultSelectedKey, value, onChange, ...rest } = props;
  const [val] = (options || []).filter(e => e.key === (defaultSelectedKey || value))
  const { text: _value } = val || {}

  return (
    <div>
      <Label>{label}</Label>
      <Select value={_value} style={{ width: "100%" }} onChange={e => onChange(options[e * 1])}>
        {options && options.map((opt, ind) => {
          return (
            <Option key={ind} value={ind}>{opt.text}</Option>
          )
        })}
      </Select>
    </div>
  )
}

const commandBarButtonDsc = {
  add: "Ekle",
  swapUp: "Yukarı Kaydır",
  swapDown: "Aşağı Kaydır",
  removeAll: "Hepsini Sil",
  remove: "Sil"

}

const CommandBarButton = props => {
  const { type, ...rest } = props;
  return (
    <div style={{ cursor: "pointer" }} {...rest}>{commandBarButtonDsc[type]}</div>
  )
}

const typeIcon = {
  add: "plus",
  removeAll: "delete",
  swapUp: "up",
  swapDown: "down",
  remove: "delete"
}

const CommandBar = props => {
  const { items, ...rest } = props;
  return (
    <div style={{ padding: "8px 0" }}>
      <Button.Group style={{ width: "100%", display: "flex" }}>
        {
          items ?
            items.map((i, index) =>
              <Button type="primary" key={index} style={{ width: "100%" }} icon={typeIcon[i.type]} onClick={i.onClick}>{commandBarButtonDsc[i.type]}</Button>
            )
            : <span>Item not found</span>}
      </Button.Group>
    </div >
  )
}

const Test = props => <div>Ohaa Çalıştı</div>

const UrlButton = props => {
  const { value: _value, onChange } = props;
  const value = { ..._value }
  return (
    <div>
      <div>
        <Label>Button Label</Label>
        <Input value={value.buttonLabel} onChange={e => onChange({ value: { ...value, buttonLabel: e.target.value } })} style={{ width: "100%" }} />
      </div>
      <div>
        <Label>Url</Label>
        <Input value={value.url} onChange={e => onChange({ value: { ...value, urlLabel: e.target.value } })} style={{ width: "100%" }} />
      </div>
    </div>
  )
}

const myStruct = {
  shorttext: TextField,
  number: NumberField,
  longtext: TextArea,
  checkbox: CheckBox,
  selectfield: Selectfield,
  commandbar: CommandBar,
  urlbutton: UrlButton
}


setSchemaField([{
  formValue: "urlbutton",
  component: "urlbutton",
  uiValue: "urlbutton",
  text: "Url Button",
}])
setStruct(myStruct);