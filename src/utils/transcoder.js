function base64Encode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/g, '')
}

module.exports = { base64Encode }
