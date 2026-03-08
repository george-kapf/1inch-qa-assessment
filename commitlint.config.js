/**
 * PHASE 1: GIT GOVERNANCE & STANDARDS
 * This file ensures every commit message follows a strict, professional format.
 * It prevents messy history and makes the repository "Release Ready."
 */
module.exports = {
  // We extend the standard 'Conventional Commits' rules used by top engineering teams.
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // ENFORCED TYPES: Any commit message not starting with one of these is rejected.
    'type-enum': [
      2, // Level 2 means "Error" (The commit will fail if the type is wrong).
      'always',
      [
        // 'test': Used when adding new Gherkin scenarios or Playwright step logic.
        'test', 
        
        // 'fix': Used for repairing a broken test, such as an outdated endpoint path.
        'fix', 
        
        // 'refactor': Used for cleaning up code (like optimizing a validator) without changing logic.
        'refactor', 
        
        // 'chore': General maintenance, like updating the 'package.json' dependencies.
        'chore', 
        
        // 'build': Specific to Docker, the Mock Services, or the Docker Compose setup.
        'build', 
        
        // 'ci': Updates to the GitHub Actions (.yml) workflow.
        'ci', 
        
        // 'docs': Updates to the README, project structure notes, or inline comments.
        'docs', 
        
        // 'perf': Optimizing test speed (e.g., reducing wait times in the 'Before' hook).
        'perf', 
        
        // 'revert': Used to undo a previous change if a bug is introduced.
        'revert',
      ],
    ],
  },
};
