/// <reference types="cypress" />
describe('outside', () => {
  context('inside', () => {
    beforeEach(() => {
      console.log('runs before each test')
    })

    it('passes', () => {
      expect(true).to.equal(true)
    })

    it('fails when env variable FAIL is set', () => {
      if (Cypress.env('FAIL')) {
        throw new Error('flaky test has failed because FAIL is set')
      }
    })
  })

  it('works from single describe', () => {})
})

it('exists by itself', () => {})
