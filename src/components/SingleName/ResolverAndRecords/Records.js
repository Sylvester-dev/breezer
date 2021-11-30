import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import styled from '@emotion/styled/macro'
import isEqual from 'lodash/isEqual'
import differenceWith from 'lodash/differenceWith'
import { useQuery } from 'react-apollo'
import { useTranslation } from 'react-i18next'
import { getNamehash } from '@ensdomains/ui'
import { validateDNSInput } from '../../../utils/records'

import { useEditable } from '../../hooks'
import { ADD_MULTI_RECORDS } from '../../../graphql/mutations'
import DNS_RECORD_KEYS from 'constants/dnsRecords'
import COIN_LIST from 'constants/coinList'
import PendingTx from '../../PendingTx'
import { emptyAddress } from '../../../utils/utils'
import { formatsByCoinType } from '@ensdomains/address-encoder'

import {
  GET_ADDRESSES,
  GET_TEXT_RECORDS,
  GET_DNS_RECORDS,
  GET_RESOLVER_FROM_SUBGRAPH
} from 'graphql/queries'

import AddRecord from './AddRecord'
import ContentHash from './ContentHash'
import TextRecord from './TextRecord'
import DNSRecord from './DNSRecord'
import Coins from './Coins'
import DefaultSaveCancel from '../SaveCancel'
import RecordsCheck from './RecordsCheck'

const RecordsWrapper = styled('div')`
  border-radius: 6px;
  border: 1px solid #ededed;
  box-shadow: inset 0 0 10px 0 rgba(235, 235, 235, 0.5);
  display: ${p => (p.shouldShowRecords ? 'block' : 'none')};
  margin-bottom: 20px;
`

const CantEdit = styled('div')`
  padding: 20px;
  font-size: 14px;
  color: #adbbcd;
  background: hsla(37, 91%, 55%, 0.1);
`

const SaveCancel = styled(DefaultSaveCancel)``

const ConfirmBox = styled('div')`
  p {
    font-weight: 300;
    font-size: 14px;
  }
  padding: 20px;
  background: #f0f6fa;
  display: flex;
  justify-content: space-between;
`

const RECORDS = [
  {
    label: 'Addresses',
    value: 'coins'
  },
  {
    label: 'Content',
    value: 'content'
  },
  {
    label: 'Text',
    value: 'textRecords'
  },
  {
    label: 'DNS',
    value: 'dnsRecords'
  }
]

const TEXT_PLACEHOLDER_RECORDS = [
  'vnd.twitter',
  'vnd.github',
  'url',
  'email',
  'avatar',
  'notice'
]

const COIN_PLACEHOLDER_RECORDS = ['ETH', ...COIN_LIST.slice(0, 3)]

function isEmpty(record) {
  if (parseInt(record, 16) === 0) {
    return true
  }
  if (record === '0x') {
    return true
  }
  if (!record) {
    return true
  }
  return false
}

function hasAnyRecord(domain) {
  if (!isEmpty(domain.addr)) {
    return true
  }

  if (!isEmpty(domain.content)) {
    return true
  }
}

function calculateShouldShowRecords(isOwner, hasResolver, hasRecords) {
  //do no show records if it only has a resolver if not owner
  if (!isOwner && hasRecords) {
    return true
  }
  //show records if it only has a resolver if owner so they can add
  if (isOwner && hasResolver) {
    return true
  }
  return false
}

function getChangedRecords(initialRecords, updatedRecords) {
  if (initialRecords.loading)
    return {
      textRecords: [],
      dnsRecords: [],
      coins: []
    }

  const keyValueEqual = function(a, b) {
    return a && b && a.key === b.key && a.value === b.value
  }

  const textRecords = differenceWith(
    updatedRecords.textRecords,
    initialRecords.textRecords,
    keyValueEqual
  )
  const dnsRecords = differenceWith(
    updatedRecords.dnsRecords,
    initialRecords.dnsRecords,
    keyValueEqual
  )
  const coins = differenceWith(
    updatedRecords.coins,
    initialRecords.coins,
    isEqual
  )

  const content = !isEqual(updatedRecords.content, initialRecords.content)
    ? updatedRecords.content
    : undefined

  return {
    textRecords,
    dnsRecords,
    coins,
    ...(content !== undefined && { content })
  }
}

function checkRecordsHaveChanged(changedRecords) {
  return (
    changedRecords.textRecords.length > 0 ||
    changedRecords.dnsRecords.length > 0 ||
    changedRecords.coins.length > 0 ||
    changedRecords.content
  )
}

function checkRecordsAreValid(changedRecords) {
  const textRecordsValid = !(
    changedRecords.textRecords.filter(record => record.isValid === false)
      .length > 0
  )
  const dnsRecordsValid = !(
    changedRecords.dnsRecords.filter(record => record.isValid === false)
      .length > 0
  )
  const coinsValid = !(
    changedRecords.coins.filter(record => record.isValid === false).length > 0
  )

  return textRecordsValid && dnsRecordsValid && coinsValid
}

function isContentHashEmpty(hash) {
  return hash?.startsWith('undefined') || parseInt(hash, 16) === 0
}

// graphql data in resolver and records to check current records
// state in resolver and records to record new edit changes
// check old and new to see if any have changed
// abstract build tx data into function and use it here
//

export default function Records({
  domain,
  isOwner,
  refetch,
  hasResolver,
  isOldPublicResolver,
  isDeprecatedResolver,
  needsToBeMigrated
}) {
  const { t } = useTranslation()
  const [addMultiRecords] = useMutation(ADD_MULTI_RECORDS, {
    onCompleted: data => {
      startPending(Object.values(data)[0])
    }
  })
  const [updatedRecords, setUpdatedRecords] = useState({
    content: undefined,
    coins: [],
    textRecords: [],
    dnsRecords: []
  })
  const { actions, state } = useEditable()
  const { pending, confirmed, editing, txHash } = state

  const {
    startPending,
    setConfirmed,
    startEditing,
    stopEditing,
    resetPending
  } = actions

  const cancelEdits = function() {
    stopEditing()
    // clear all uncommitted changes
    setUpdatedRecords(initialRecords)
  }

  const { data: dataResolver } = useQuery(GET_RESOLVER_FROM_SUBGRAPH, {
    variables: {
      id: getNamehash(domain.name)
    }
  })

  const resolver =
    dataResolver && dataResolver.domain && dataResolver.domain.resolver

  const coinList =
    resolver &&
    resolver.coinTypes &&
    resolver.coinTypes.map(c => formatsByCoinType[c].name)

  const {
    loading: addressesLoading,
    data: dataAddresses,
    refetch: refetchAddresses
  } = useQuery(GET_ADDRESSES, {
    variables: { name: domain.name, keys: coinList },
    skip: !coinList
  })

  const {
    loading: textRecordsLoading,
    data: dataTextRecords,
    refetch: refetchTextRecords
  } = useQuery(GET_TEXT_RECORDS, {
    variables: {
      name: domain.name,
      keys: resolver && resolver.texts
    },
    skip: !dataResolver || !resolver || !resolver.texts
  })

  const {
    loading: getDnsRecordsLoading,
    data: dataDnsRecords,
    refetch: refetchDnsRecords
  } = useQuery(GET_DNS_RECORDS, {
    variables: {
      name: domain.name,
      types: DNS_RECORD_KEYS
    },
    skip: !dataResolver
  })

  const dnsRecordsLoading = getDnsRecordsLoading && dataDnsRecords

  function processRecords(records, placeholder) {
    const nonDuplicatePlaceholderRecords = placeholder.filter(
      record => !records.find(r => record === r.key)
    )
    return [
      ...records,
      ...nonDuplicatePlaceholderRecords.map(record => ({
        key: record,
        value: ''
      }))
    ]
  }

  const initialRecords = {
    textRecords:
      dataTextRecords && dataTextRecords.getTextRecords
        ? processRecords(
            dataTextRecords.getTextRecords,
            TEXT_PLACEHOLDER_RECORDS
          )
        : processRecords([], TEXT_PLACEHOLDER_RECORDS),
    dnsRecords:
      dataDnsRecords && dataDnsRecords.getDNSRecords
        ? processRecords(dataDnsRecords.getDNSRecords, DNS_RECORD_KEYS)
        : processRecords([], DNS_RECORD_KEYS),
    coins:
      dataAddresses && dataAddresses.getAddresses
        ? processRecords(dataAddresses.getAddresses, COIN_PLACEHOLDER_RECORDS)
        : processRecords([], COIN_PLACEHOLDER_RECORDS),
    content: isContentHashEmpty(domain.content) ? '' : domain.content,
    loading: textRecordsLoading || dnsRecordsLoading || addressesLoading
  }

  useEffect(() => {
    if (
      textRecordsLoading === false &&
      dnsRecordsLoading === false &&
      addressesLoading === false
    ) {
      setUpdatedRecords(initialRecords)
    }
  }, [
    textRecordsLoading,
    dnsRecordsLoading,
    addressesLoading,
    dataAddresses,
    dataTextRecords,
    dataDnsRecords
  ])

  const emptyRecords = RECORDS.filter(record => {
    // Always display all options for consistency now that both Addess and text almost always have empty record
    return true
  })

  const hasRecords = hasAnyRecord(domain) || true

  const changedRecords = getChangedRecords(initialRecords, updatedRecords)
  const contentCreatedFirstTime =
    !initialRecords.content && !!updatedRecords.content
  const shouldShowRecords = calculateShouldShowRecords(
    isOwner,
    hasResolver,
    hasRecords
  )
  const canEditRecords =
    !isOldPublicResolver && !isDeprecatedResolver && isOwner && !pending

  if (!shouldShowRecords) {
    return null
  }

  const haveRecordsChanged = checkRecordsHaveChanged(changedRecords)
  let areRecordsValid = checkRecordsAreValid(changedRecords)

  const basicRecordsChanged =
    changedRecords.textRecords.length > 0 ||
    changedRecords.coins > 0 ||
    updatedRecords.content !== initialRecords.content

  const dnsRecordsChanged = changedRecords.dnsRecords.length > 0

  // we don't support changing DNS records with other
  // types of records for now
  if (dnsRecordsChanged && basicRecordsChanged) {
    areRecordsValid = false
  }

  return (
    <RecordsWrapper
      shouldShowRecords={shouldShowRecords}
      needsToBeMigrated={needsToBeMigrated}
    >
      {!canEditRecords && !pending && isOwner ? (
        <CantEdit>{t('singleName.record.cantEdit')}</CantEdit>
      ) : (
        <AddRecord
          domain={domain}
          canEdit={canEditRecords}
          editing={editing}
          startEditing={startEditing}
          stopEditing={cancelEdits}
          initialRecords={initialRecords}
          updatedRecords={updatedRecords}
          setUpdatedRecords={setUpdatedRecords}
          emptyRecords={emptyRecords}
        />
      )}
      <Coins
        canEdit={canEditRecords}
        editing={editing}
        domain={domain}
        addresses={updatedRecords.coins}
        loading={addressesLoading}
        title={t('c.addresses')}
        updatedRecords={updatedRecords}
        setUpdatedRecords={setUpdatedRecords}
        changedRecords={changedRecords}
      />
      <ContentHash
        canEdit={canEditRecords}
        editing={editing}
        domain={domain}
        keyName="Content"
        type="content"
        value={updatedRecords.content}
        refetch={refetch}
        changedRecords={changedRecords}
        updatedRecords={updatedRecords}
        setUpdatedRecords={setUpdatedRecords}
      />
      <TextRecord
        canEdit={canEditRecords}
        editing={editing}
        domain={domain}
        textRecords={dataTextRecords && dataTextRecords.getTextRecords}
        loading={textRecordsLoading}
        title={t('c.textrecord')}
        updatedRecords={updatedRecords}
        placeholderRecords={TEXT_PLACEHOLDER_RECORDS}
        setUpdatedRecords={setUpdatedRecords}
        changedRecords={changedRecords}
      />
      <span
        style={{
          borderTop: '1px dashed #d3d3d3',
          paddingTop: '20px',
          display: 'block'
        }}
      />
      <DNSRecord
        canEdit={canEditRecords}
        editing={editing}
        domain={domain}
        validator={(type, value) => {
          return validateDNSInput(type, value)
        }}
        dnsRecords={dataDnsRecords && dataDnsRecords.getDNSRecords}
        loading={dnsRecordsLoading}
        title={t('c.dnsrecord')}
        updatedRecords={updatedRecords}
        placeholderRecords={DNS_RECORD_KEYS}
        setUpdatedRecords={setUpdatedRecords}
        changedRecords={changedRecords}
      />
      {pending && !confirmed && txHash && (
        <ConfirmBox pending={pending}>
          <PendingTx
            txHash={txHash}
            onConfirmed={() => {
              setConfirmed()
              resetPending()

              // update initialRecords
              // to prevent further edits from
              // happening on stale data
              if (dnsRecordsChanged) {
                refetchDnsRecords()
              }

              if (basicRecordsChanged) {
                refetchTextRecords()
                refetchAddresses()
              }
            }}
          />
        </ConfirmBox>
      )}
      {editing && !txHash && (
        <ConfirmBox>
          <p>
            Add, delete, or edit one or multiple records. Confirm in one
            transaction.
          </p>
          <SaveCancel
            mutation={() => {
              addMultiRecords({
                variables: { name: domain.name, records: changedRecords }
              })
            }}
            mutationButton="Confirm"
            stopEditing={cancelEdits}
            disabled={false}
            confirm={true}
            extraDataComponent={
              <RecordsCheck
                changedRecords={changedRecords}
                contentCreatedFirstTime={contentCreatedFirstTime}
                parentName={domain.parent}
                name={domain.name}
              />
            }
            isValid={haveRecordsChanged && areRecordsValid}
          />
        </ConfirmBox>
      )}
    </RecordsWrapper>
  )
}
