// yes this really can and should live in its own module!
const validators = require('../src/api/validate').parameterized

describe('GIVEN initialzed inRange validator', () => {
  let inRange = validators.inRange({min: 1, max: 100})

  describe('WHEN checking null', () => {
    it('THEN it fails', () => expect(inRange(null)).toBeFalsy())
  })

  describe('WHEN checking strings', () => {
    it('THEN it fails', () => expect(inRange('')).toBeFalsy())
  })

  describe('WHEN checking below range number', () => {
    it('THEN it fails', () => expect(inRange(-1)).toBeFalsy())
  })

  describe('WHEN checking beyond range number', () => {
    it('THEN it fails', () => expect(inRange(101)).toBeFalsy())
  })

  describe('WHEN checking in range number', () => {
    it('THEN it succeeds', () => expect(inRange(50)).toBeTruthy())
  })

  describe('WHEN checking scalar number', () => {
    it('THEN it succeeds', () => expect(inRange('50')).toBeTruthy())
  })
})