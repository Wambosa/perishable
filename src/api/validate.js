const { superstruct } = require('superstruct'),
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

    let err

    try {
      let report = model.validate(body)
      err = report[0]
    } catch (e) {
      err = e
    }

    return err
  }

  static extraProps(ext, validators) {
    let custom = {}

    for (let prop in validators)
      custom[prop] = input.intersection(validators[prop])

    let model = input.partial(custom)

    let err
    try {
      let report = model.validate(ext)
      err = report[0]
    }
    catch (e) {
      err = e
    }

    return err
  }

  static hasRequired(rules) {
    return rules.filter && rules.filter(r => r.rule_name === 'required')
      .map(r => `Required extended property ${r.key}`)
      .join('. ')
  }
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