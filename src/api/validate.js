const { struct, superstruct } = require('superstruct'),
  input = superstruct({
    types: {
      'required': val => !!val,
      'yyyy-mm-dd': val => /^\d{4}-\d{1,2}-\d{1,2}$/.test(val),
      'isLetter': val => /^[a-zA-Z]{1}$/.test(val),
      'isHexColor': val => /^(#|)([0-9A-F]{3}|[0-9A-F]{6})$/i.test(val),
      'isInteger': val => Number.isInteger(val),
    }
  }),
  parameterized = {
    inRange,
  }

class validate {

  static unit(body) {
    const model = input.partial({
      name: 'string',
      group_id: 'isInteger',
      desc: 'string?',
      mass: 'number?',
      expire: 'yyyy-mm-dd?',
    })

    return trySuperstruct(model, body)
  }

  static unitGroup(body) {
    const model = struct.partial({
      name: 'string',
      desc: 'string',
    })

    return trySuperstruct(model, body)
  }

  static rule(rule) {
    const model = struct.partial({
      rule_name: 'string',
      key: 'string',
    })

    return trySuperstruct(model, rule)
  }

  static ruleMap(rules) {
    const model = struct.partial({
      rule_name: 'string',
      key: 'string',
    })

    let report
    rules.find(r => {
      report = validate.rule(r)
      return !!report
    })

    return report
  }

  static extraProps(ext, validators) {
    let custom = {}

    for (let prop in validators)
      custom[prop] = input.intersection(validators[prop])

    let model = input.partial(custom)

    return trySuperstruct(model, ext)
  }

  static hasRequired(rules) {
    return rules.filter && rules.filter(r => r.rule_name === 'required')
      .map(r => `Required extended property ${r.key}`)
      .join('. ')
  }
}

const trySuperstruct = (model, data) => {
  let err

  try {
    let report = model.validate(data)
    err = report[0]
  } catch (e) {
    err = e
  }

  return err
}

const build = rules => {
  let validators = {}

  rules.forEach(r => {
    let prop = r.key,
      rule = r.rule_name

    if(!validators[prop])
      validators[prop] = []

    if(parameterized[rule])
      validators[prop].push(parameterized[rule](r.params))
    else
      validators[prop].push(rule)
  })

  return validators
}

function inRange(params) {
  return val => !isNaN(val) && val >= params.min && val <= params.max
}

module.exports = {
  validate,
  build,
  parameterized,
}