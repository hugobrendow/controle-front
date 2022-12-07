import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Início',
    type: 'item',
    icon: 'home',
    url: 'home'
  },
  {
    id: 'provider',
    title: 'Fornecedores',
    type: 'item',
    icon: 'truck',
    url: 'fornecedores'
  },
  {
    id: 'charge',
    title: 'Despesas',
    type: 'item',
    icon: 'file',
    url: 'despesas'
  },
]
