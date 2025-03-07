import { expect } from 'chai'
import { processDataV1, processDataV2, stats } from '../src/exo4-exo5.js'

const sampleCSV = `
username,realName,website,projectName
alice,Alice Wonderland,www.alice.com,Alpha
bob,Bob Builder,,Beta
charlie,Charlie Chaplin,www.charlie.com,Alpha
dave,David Copperfield,,Gamma
alice,Alice Wonderland,www.alice.com,Beta
bob,Bob Builder,,Alpha
alice,Alice Wonderland,www.alice.com,Alpha
`

const expectedData = [
  { username: "alice", realName: "Alice Wonderland", website: "www.alice.com", projectName: "Alpha" },
  { username: "bob", realName: "Bob Builder", website: null, projectName: "Beta" },
  { username: "charlie", realName: "Charlie Chaplin", website: "www.charlie.com", projectName: "Alpha" },
  { username: "dave", realName: "David Copperfield", website: null, projectName: "Gamma" },
  { username: "alice", realName: "Alice Wonderland", website: "www.alice.com", projectName: "Beta" },
  { username: "bob", realName: "Bob Builder", website: null, projectName: "Alpha" },
  { username: "alice", realName: "Alice Wonderland", website: "www.alice.com", projectName: "Alpha" },
]

describe('ex. 4 CSV Parsing', function () {
  const implementations = [
    { name: 'processDataV1', func: processDataV1 },
    { name: 'processDataV2', func: processDataV2 },
  ]

  implementations.forEach(({ name, func }) => {
    describe(name, function () {
      it('should parse CSV text and return the expected array of objects', function () {
        const result = func(sampleCSV)
        expect(result).to.deep.equal(expectedData)
      })

      it('should return an empty array when CSV contains only a header row', function () {
        const headerOnly = "username,realName,website,projectName"
        const result = func(headerOnly)
        expect(result).to.deep.equal([])
      })
    })
  })
})

describe('ex. 5 - CSV Stats', function () {
  it('should compute statistics correctly for multiple rows', function () {
    const result = stats(sampleCSV)
    expect(result).to.be.an('object')
    expect(result.FirstProject).to.equal("Alpha")
    expect(result.UniqueContributors).to.equal(4)
    expect(result.AverageContributors).to.equal(14.75)
    expect(result.MostActiveContributor).to.equal("Alice Wonderland")
    expect(result.Top10Projects).to.deep.equal(["Alpha", "Beta", "Gamma"])
  })

  it('should compute correct stats when CSV has only one data row', function () {
    const singleRowCSV = `
username,realName,website,projectName
john,John Doe,www.johndoe.com,ProjectX
    `
    const result = stats(singleRowCSV)
    expect(result.FirstProject).to.equal("ProjectX")
    expect(result.UniqueContributors).to.equal(1)
    expect(result.AverageContributors).to.equal("John Doe".length)
    expect(result.MostActiveContributor).to.equal("John Doe")
    expect(result.Top10Projects).to.deep.equal(["ProjectX"])
  })
})
