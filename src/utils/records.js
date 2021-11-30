import { encodeContenthash, isValidContenthash } from '@ensdomains/ui'
import { addressUtils } from 'utils/utils'
import { normalizeTXT, serializeRecord } from './dns'
import { formatsByName } from '@ensdomains/address-encoder'
import bns from 'bns'

export function validateDNSInput(type, value) {
  if (value === '') return true

  const record = serializeRecord('example.eth.', '0', type, value)
  try {
    bns.wire.Record.fromString(record)
    return true
  } catch (e) {
    return false
  }
}

export function validateRecord({ type, value, contentType, selectedKey }) {
  if (!type) return false
  if (!value) return false
  if (type === 'content' && contentType === 'oldcontent') {
    return value.length > 32
  }

  switch (type) {
    case 'address':
      const isAddress = addressUtils.isAddress(value)
      return isAddress
    case 'content':
      if (value === EMPTY_ADDRESS) return true // delete record
      const encoded = encodeContenthash(value)
      if (encoded) {
        return isValidContenthash(encoded)
      } else {
        return false
      }
    case 'textRecords':
      return true
    case 'dnsRecords':
      return validateDNSInput(selectedKey, value)
    case 'coins':
      if (value === '') return false
      if (selectedKey === 'ETH') {
        return addressUtils.isAddress(value)
      }
      try {
        formatsByName[selectedKey].decoder(value)
        return true
      } catch {
        return false
      }
    default:
      throw new Error('Unrecognised record type')
  }
}

export function getPlaceholder(recordType, contentType) {
  switch (recordType) {
    case 'address':
      return 'Enter an Ethereum address'
    case 'content':
      if (contentType === 'contenthash') {
        return 'Enter a content hash (eg: /ipfs/..., ipfs://..., /ipns/..., ipns://..., bzz://..., onion://..., onion3://...)'
      } else {
        return 'Enter a content'
      }
    default:
      return ''
  }
}

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'

export function isEmptyAddress(address) {
  return parseInt(address) === 0
}
