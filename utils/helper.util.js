exports._errorFormatter = errors => {
  const res = []

  for (let i = 0; i < errors.length; i++) {
    res.push(errors[i].msg)
  }

  return res.join('. ')
}
