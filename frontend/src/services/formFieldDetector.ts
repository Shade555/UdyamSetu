export type FormFieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'select' | 'textarea' | 'range'

export interface FormField {
  id: string
  name: string
  type: FormFieldType
  label: string
  value: string
  placeholder?: string
  required: boolean
  min?: string
  max?: string
  options?: string[]
}

const fieldSelector = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea'

function getLabel(element: HTMLElement): string {
  const explicit = element.id
    ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent
    : undefined
  const nearby = element.closest('div')?.querySelector('label')?.textContent
  return (explicit || nearby || element.getAttribute('aria-label') || element.getAttribute('name') || element.id || '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Returns only fields that are safe for an assistant to populate. Passwords are deliberately excluded. */
export function detectFormFields(): FormField[] {
  return Array.from(document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(fieldSelector))
    .filter((element) => element.type !== 'password' && !element.disabled && element.offsetParent !== null)
    .map((element, index) => {
      if (!element.id) element.id = element.name || `udyamsetu-field-${index}`
      const select = element instanceof HTMLSelectElement ? element : undefined
      return {
        id: element.id,
        name: element.getAttribute('name') || element.id,
        type: (element instanceof HTMLTextAreaElement ? 'textarea' : element.type || 'text') as FormFieldType,
        label: getLabel(element),
        value: element.value,
        placeholder: element.getAttribute('placeholder') || undefined,
        required: element.required,
        min: element.getAttribute('min') || undefined,
        max: element.getAttribute('max') || undefined,
        options: select ? Array.from(select.options).map((option) => option.text) : undefined,
      }
    })
}

export function validateFieldValue(field: FormField, value: string): string | undefined {
  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please provide a valid email address.'
  if (field.type === 'tel' && !/^[+\d][\d\s()-]{6,}$/.test(value)) return 'Please provide a valid phone number.'
  if (field.type === 'number' || field.type === 'range') {
    const number = Number(value)
    if (!Number.isFinite(number)) return 'Please provide a valid number.'
    if (field.min && number < Number(field.min)) return `The value must be at least ${field.min}.`
    if (field.max && number > Number(field.max)) return `The value must be at most ${field.max}.`
  }
  if (field.required && !value.trim()) return `${field.label || field.name} is required.`
}

/** Uses the native setter so controlled React inputs receive the same change notification as user input. */
export function fillFormField(field: FormField, value: string): boolean {
  const element = document.getElementById(field.id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
  if (!element || element.type === 'password' || element.disabled) return false
  const validationError = validateFieldValue(field, value)
  if (validationError) return false

  const prototype = element instanceof HTMLSelectElement ? HTMLSelectElement.prototype
    : element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
  setter?.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
  element.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}
