import { setupENS } from '@ensdomains/ui'

let ens = {},
  registrar = {},
  ensRegistryAddress = undefined

export async function setup({
  reloadOnAccountsChange,
  enforceReadOnly,
  enforceReload,
  customProvider,
  ensAddress = process.env.REACT_APP_ENS_ADDRESS
}) {
  let option = {
    reloadOnAccountsChange,
    enforceReadOnly,
    enforceReload,
    customProvider,
    ensAddress
  }
  if (enforceReadOnly) {
    option.infura = process.env.REACT_APP_INFURA_ID
  }
  const { ens: ensInstance, registrar: registrarInstance } = await setupENS(
    option
  )
  ens = ensInstance
  registrar = registrarInstance
  ensRegistryAddress = ensAddress
  return { ens, registrar }
}

export function getRegistrar() {
  return registrar
}

export function getEnsAddress() {
  return ensRegistryAddress
}

export default function getENS() {
  return ens
}
