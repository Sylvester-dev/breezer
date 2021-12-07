import React from 'react'
import { useState, useEffect } from 'react'
import { db } from '../firebase-config'
import { collection, getDocs, addDoc } from 'firebase/firestore'

function TestDb() {
  const [domainName, setDomainName] = useState('')
  const [userAddress, setUserAddress] = useState('')

  const [users, setUsers] = useState([])
  const usersCollection = collection(db, 'users')

  const createUser = async () => {
    await addDoc(usersCollection, { name: domainName, address: userAddress })
  }

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollection)
      setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    getUsers()
  }, [])

  return (
    <div className="App">
      <input
        placeholder=".cns Domain"
        onChange={event => {
          setDomainName(event.target.value)
        }}
      />
      <input
        placeholder="user address"
        onChange={event => {
          setUserAddress(event.target.value)
        }}
      />

      <button onClick={createUser}> Register user domain</button>
      {users.map(user => {
        return (
          <div>
            {' '}
            <h1>Domain: {user.name}</h1>
            <h1>Address: {user.address}</h1>
          </div>
        )
      })}
    </div>
  )
}

export default TestDb
