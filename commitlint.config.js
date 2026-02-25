module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Anything not in this list is rejected
    'type-enum': [
      2,
      'always',
      [
        'test', // Adding or updating test scenarios, step definitions or assertions (primary type)
        'fix', // Fixing a broken test — e.g. a step that stopped working, a wrong assertion, an outdated endpoint path
        'refactor', // Restructuring test code without changing what is tested
        'chore', // Dependency updates, tooling config, non-test maintenance
        'build', // Docker, mock services, or build-pipeline changes
        'ci', // CI/CD workflow configuration
        'docs', // README, HANDOVER or inline documentation updates
        'perf', // Improving test execution speed or reducing unnecessary waiting
        'revert', // Reverts a previous commit
      ],
    ],
  },
};
