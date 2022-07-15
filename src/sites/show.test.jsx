/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ShowSite from './show'

describe('<ShowSite />', () => {
  test('showContent: should be called on element click', async () => {
    const mockFn = jest.fn()

    render(<ShowSite url="test" id="test" showContent={mockFn} />)

    let element = screen.getByText(/test/i)

    expect(element).toBeInTheDocument()
    element.click()

    await waitFor(() => expect(mockFn).toHaveBeenCalled())
    expect(mockFn).toHaveBeenCalled()
  })

  test('handleEdit: should be callend on the Edit click', () => {
    const mockFn = jest.fn()

    render(<ShowSite url="test" id="test" handleEdit={mockFn} />)

    let element = screen.getByText(/Edit/i)

    expect(element).toBeInTheDocument()
    element.click()

    expect(mockFn).toHaveBeenCalled()
  })

  test('handleDelete: should call delete on confirmation', () => {
    global.confirm = jest.fn(() => true)

    const mockFn = jest.fn()

    render(<ShowSite url="test" id="test" handleDelete={mockFn} />)

    let element = screen.getByText(/Delete/i)

    expect(element).toBeInTheDocument()
    element.click()

    expect(global.confirm).toHaveBeenCalled()
    expect(mockFn).toHaveBeenCalled()
  })

  test('handleDelete: should not call delete on confirmation', () => {
    global.confirm = jest.fn(() => false)

    const mockFn = jest.fn()

    render(<ShowSite url="test" id="test" handleDelete={mockFn} />)

    let element = screen.getByText(/Delete/i)

    expect(element).toBeInTheDocument()
    element.click()

    expect(global.confirm).toHaveBeenCalled()
    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
