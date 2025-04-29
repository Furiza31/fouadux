import { expect } from 'chai'
import { map } from '../src/exo3.js'

describe('ex. 3', function () {
  describe('map(array, fn)', function () {
    it('should return a new array', function () {
      const originalArray = []

      expect(map(originalArray, x => x)).to.not.eq(originalArray)

      expect(map(originalArray, x => x)).to.deep.eq([])
    })

    it('should apply the function to each item in the array', function () {
      expect(map([1, 2, 3, 4, 5], x => x * 2)).to.deep.eq([2, 4, 6, 8, 10])
    })

    it('should not mutate the original array', function () {
      const originalArray = [1, 2, 3, 4, 5]
      map(originalArray, x => x * 2)
      expect(originalArray).to.deep.eq([1, 2, 3, 4, 5])
    })

    it('should handle an empty array', function () {
      expect(map([], x => x * 2)).to.deep.eq([])
    })

    it('should handle different types of functions', function () {
      expect(map(['a', 'b', 'c'], x => x.toUpperCase())).to.deep.eq(['A', 'B', 'C'])
    })
  })
})