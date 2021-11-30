import React from 'react'
import KeyValueRecord from '../KeyValueRecord'

const getPlaceholder = key => {
  return `Enter ${key}`
}

export default function DNSRecords(props) {
  return (
    <KeyValueRecord
      {...props}
      records={props.updatedRecords.dnsRecords}
      getPlaceholder={getPlaceholder}
      setUpdatedRecords={props.setUpdatedRecords}
      recordType="dnsRecords"
    />
  )
}
