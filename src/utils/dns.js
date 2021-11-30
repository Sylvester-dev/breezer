// zone file TXT value format
import bns from 'bns'

export function normalizeTXT(txt) {
  const t = txt.trim()
  if (t === '') return '"' + txt + '"'

  if (t[0] !== '"' || t[t.length - 1] !== '"') {
    const escape = txt.replace(/"/g, '\\"')
    return '"' + escape + '"'
  }

  return txt
}

export function serializeRecord(name, ttl, type, value) {
  name = bns.util.fqdn(name)

  if (type === 'TXT' && value !== '') value = normalizeTXT(value)
  if (type === 'CNAME' && value !== '') value = bns.util.fqdn(value)
  const dns = toDNSName(name, type)

  return dns.name + ' ' + ttl + ' IN ' + dns.type + ' ' + value
}

export function toDNSName(node, type) {
  let name = node
  if (type === 'TLSA (443, tcp)') {
    type = 'TLSA'
    name = '_443._tcp.' + name
  }

  return { node, name, type }
}
