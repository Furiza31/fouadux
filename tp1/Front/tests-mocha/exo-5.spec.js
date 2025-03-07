import { expect } from 'chai'
import { analyzeCsv } from "../src/exo4-exo5.js"

describe('ex. 5', function () {
  describe('analyzeCsv()', function () {
    it('should compute various statistics about contributors', async function () {
      const stats = await analyzeCsv()
      expect(stats.FirstProject).to.eq('abdera')
      expect(stats.UniqueContributors).to.eq(4595)
      expect(stats.AverageContributors.toFixed(2)).to.eq('14.21')
      expect(stats.MostActiveContributor).to.eq('Jim Jagielski')
      expect(stats.Top10Projects).to.deep.eq([
        'incubator',
        'Apache Software Foundation',
        'member',
        'apsite',
        'ws',
        'incubator-pmc',
        'pmc-chairs',
        'openoffice',
        'httpd',
        'commons'
      ])
    })
  })
})