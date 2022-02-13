module.exports = {
  'help': {
    description: 'Shows the list of commands or help on specified command.',
    format: 'help [command-name]'
  },
  'ping': {
    description: 'Checks connectivity with discord\'s servers.',
    format: 'ping'
  },
  'add-coins': {
    aliases: ['add-points'],
    description: 'Add coins to a user',
    format: 'add-coins <user mention> <amount>'
  }
}