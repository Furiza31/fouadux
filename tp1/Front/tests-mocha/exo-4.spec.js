import { expect } from "chai"
import { processDataFunc, processDataImp } from "../src/exo4-exo5.js"

describe('ex. 4', function () {
  const csvText = [
    'svn_id,real_name,web_site,project_name',
    'aadamchik,Andrus Adamchik,,apsite',
    'aaron,Aaron Bannert,http://www.clove.org/~aaron/,apr'
  ].join('\n')

  for (const implementation of [processDataImp, processDataFunc]) {
    describe(`${implementation.name}(csvText)`, function () {
      it('should ignore the header line', function () {
        expect(implementation(csvText).length).to.eq(2)
      })

      it('should have [username, realName, website, projectName] on each contribution', function () {
        const result = implementation(csvText)
        expect(Object.keys(result[0])).to.have.members(['username', 'realName', 'website', 'projectName'])
        expect(Object.keys(result[1])).to.have.members(['username', 'realName', 'website', 'projectName'])
      })

      it('should parse username, realName and projectName', function () {
        const result = implementation(csvText)
        expect(result[result.length - 2].username).to.eq('aadamchik')
        expect(result[result.length - 2].realName).to.eq('Andrus Adamchik')
        expect(result[result.length - 2].projectName).to.eq('apsite')
        expect(result[result.length - 1].username).to.eq('aaron')
        expect(result[result.length - 1].realName).to.eq('Aaron Bannert')
        expect(result[result.length - 1].projectName).to.eq('apr')
      })

      it('should set website to null if not provided', function () {
        const result = implementation(csvText)
        expect(result[result.length - 2].website).to.be.null
        expect(result[result.length - 1].website).to.be.string
      })
    })
  }
})