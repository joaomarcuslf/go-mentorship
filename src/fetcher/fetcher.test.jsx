/* eslint-disable testing-library/prefer-query-by-disappearance */
/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react'
import { render, screen, waitFor, waitForElementToBeRemoved, act } from '@testing-library/react'
import Fetcher from './fetcher'

describe('<Fetcher />', () => {
  test('> loading: should call action function', async () => {
    const action = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ info: "test loading" }) }))

    render(
      <Fetcher action={action}>
        {(data) => <div>{data.info}</div>}
      </Fetcher>
    )

    await waitFor(() => expect(action).toBeCalled())

    expect(action).toBeCalled()
  })

  test('> error: should show error', async () => {
    const action = jest.fn(() => Promise.resolve({ json: () => Promise.reject({ message: "test error" }) }))

    act(() => {
      render(
        <Fetcher action={action}>
          {(data) => <div>{data.info}</div>}
        </Fetcher>
      )
    })

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))

    await screen.findByText(/test error/i)
  })

  test('> success: should show the content', async () => {
    const action = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ info: "test success" }) }))

    act(() => {
      render(
        <Fetcher action={action}>
          {(data) => <div>{data.info}</div>}
        </Fetcher>
      )
    })


    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))

    await screen.findByText(/test success/i)
  })
})
