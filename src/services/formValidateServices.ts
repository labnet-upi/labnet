import type { FormRules } from 'element-plus'

// Fungsi bantu ubah camelCase jadi label title-case
function camelToTitle(camel: string) {
  return camel
    .replace(/([A-Z])/g, ' $1')   // pisahkan huruf kapital
    .replace(/^./, str => str.toUpperCase()) // kapitalisasi huruf pertama
    .trim()
}

type ExceptionConfig = Record<string, false | any[]> | string[]

export function generateRules(
  formObj: Record<string, any>,
  trigger: 'blur' | 'change' = 'blur',
  exceptions: ExceptionConfig = {}
): FormRules {
  const rules: FormRules = {}

  const isStringArray = Array.isArray(exceptions)

  for (const key of Object.keys(formObj)) {
    const exception = isStringArray ? (exceptions as string[]).includes(key) ? false : undefined : (exceptions as Record<string, false | any[]>)[key]

    if (exception === false) continue

    rules[key] = Array.isArray(exception)
      ? exception
      : [{
          required: true,
          message: `${camelToTitle(key)} harus diisi`,
          trigger
        }]
  }

  return rules
}