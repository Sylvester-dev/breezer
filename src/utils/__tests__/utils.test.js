import { validateName } from '../utils'

test('test valid names', () => {
  const tld = process.env.REACT_APP_REGISTRAR_TLD
  expect(validateName('vitalik')).toBe('vitalik')
  expect(validateName('Vitalik')).toBe('vitalik')
  expect(validateName('Vitalik.' + tld)).toBe('vitalik.' + tld)
  expect(validateName('sub.Vitalik.' + tld)).toBe('sub.vitalik.' + tld)
})

test('test invalid names', () => {
  expect(() => validateName('$vitalik')).toThrowError('Illegal char $')
  expect(() => validateName('#vitalik')).toThrowError('Illegal char #')
  expect(() => validateName('vitalik ')).toThrowError('Illegal char ')
})
