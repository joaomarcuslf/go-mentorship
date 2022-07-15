/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react'
import { render, screen } from '@testing-library/react'
import SitesList from './list'

describe('<SitesList />', () => {
  test('renders an empty list', () => {
    render(<SitesList />)

    const element = screen.getByText(/No sites/i)

    expect(element).toBeInTheDocument()
  })

  test('renders an list with multiple elements', () => {
    const { container } = render(<SitesList data={{sites: [ { url: "test" }, { url: "test" } ,{ url: "test" } ]}} />)

    const element = container.querySelectorAll('.site-item')

    expect(element.length).toBe(3)
  })

  test('delete is called on confirmation', () => {
    global.confirm = jest.fn(() => true)

    const deleteSite = jest.fn()

    render(<SitesList data={{sites: [ { url: "test" } ]}} handleDelete={deleteSite} />)

    let element = screen.getByText(/Delete/i)

    expect(element).toBeInTheDocument()
    element.click()

    expect(global.confirm).toHaveBeenCalled()
    expect(deleteSite).toHaveBeenCalled()
  })

  test('delete not called if not confirmed', () => {
    global.confirm = jest.fn(() => false)

    const deleteSite = jest.fn()

    render(<SitesList data={{sites: [ { url: "test" } ]}} handleDelete={deleteSite} />)

    let element = screen.getByText(/Delete/i)

    expect(element).toBeInTheDocument()
    element.click()

    expect(global.confirm).toHaveBeenCalled()
    expect(deleteSite).toHaveBeenCalledTimes(0)
  })
})
