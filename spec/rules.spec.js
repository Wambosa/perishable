const { validate, build } = require('../src/api/validate')

describe('GIVEN a db list of rules', () => {
  let requiredExists = [
    { rule_name: 'inRange', key: 'age', params: { min: 18, max: 130 } },
    { rule_name: 'isHexColor', key: 'color', params: null },
    { rule_name: 'isLetter', key: 'mood', params: null },
    { rule_name: 'required', key: 'mood', params: null },
    { rule_name: 'required', key: 'name', params: null },
    { rule_name: 'string', key: 'name', params: null },
  ],
  requiredMissing = [
    { rule_name: 'isRedTone', key: 'color', params: null },
    { rule_name: 'isBlueTone', key: 'mood', params: null },
  ]

  describe('WHEN finding "required" rule', () => {
    it('THEN return truthy', () => {
      expect(validate.hasRequired(requiredExists)).toBeTruthy()
    })
  })

  describe('WHEN no "required" rule exists', () => {
    it('THEN return falsy', () => {
      expect(validate.hasRequired(requiredMissing)).toBeFalsy()
    })
  })

  describe('WHEN building validators', () => {
    let validators
    beforeEach(() => validators = build(requiredExists))

    it('THEN a single object is returned', () => {
      expect(validators).toEqual(jasmine.any(Object))
      expect(validators).not.toEqual(jasmine.any(Array))
    })

    it('THEN each propertyName contains its own rules', () => {
      expect(validators.age).toEqual(jasmine.any(Array))
      expect(validators.color).toEqual(jasmine.any(Array))
      expect(validators.mood).toEqual(jasmine.any(Array))
    })
  })

  describe('WHEN validating with custom rules', () => {
    let validators = build(requiredExists),
      fullExt = {
        name: 'goku',
        age: 30,
        color: '#3EF',
        mood: 'A',
      },
      badName = {
        name: '',
        age: 30,
        color: '#3EF',
        mood: 'A',
      },
      extraProps = {
        name: 'vegeta',
        age: 30,
        color: '#3EF',
        mood: 'A',
        random: 55,
      }

    it('THEN multiple rules per property are honored', () => {
      expect(validate.extraProps(badName, validators)).toBeTruthy()
      expect(validate.extraProps(fullExt, validators)).toBeFalsy()
    })

    it('THEN extra properties are ignored', () => {
      expect(validate.extraProps(extraProps, validators)).toBeFalsy()
    })
  })
})
