ATEM   = require './atem.coffee'

ATEM_ADDR = process.env['ATEM_ADDR'] || '172.16.0.2'
ATEM_PORT = process.env['ATEM_PORT'] || 9910

sw = new ATEM
sw.connect(ATEM_ADDR, ATEM_PORT)
