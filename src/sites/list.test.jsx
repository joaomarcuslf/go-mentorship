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
    const { container } = render(<SitesList data={{sites: [ { URL: "test" }, { URL: "test" } ,{ URL: "test" } ]}} />)

    const element = container.querySelectorAll('li')

    expect(element.length).toBe(3)
  })
})
