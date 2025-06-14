/**
 * @fileoverview Script to validate tree-shaking effectiveness
 * @author ArlindMaliqi
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Test tree-shaking by importing specific modules
 */
const testCases = [
  {
    name: 'Core Components Only',
    imports: `import { FeedbackButton } from './dist/index.esm.js';`,
    expectedSize: 15000 // bytes
  },
  {
    name: 'Optimized Widget',
    imports: `import { OptimizedFeedbackWidget } from './dist/index.esm.js';`,
    expectedSize: 25000
  },
  {
    name: 'Types Only',
    imports: `import type { FeedbackConfig } from './dist/index.esm.js';`,
    expectedSize: 0
  },
  {
    name: 'Utilities Only',
    imports: `import { generateId } from './dist/index.esm.js';`,
    expectedSize: 5000
  }
];

/**
 * Validates tree-shaking for each test case
 */
function validateTreeShaking() {
  console.log('🌳 Validating tree-shaking effectiveness...\n');
  
  let allPassed = true;
  
  testCases.forEach((testCase, index) => {
    try {
      // Create temporary test file
      const testFile = `temp-test-${index}.js`;
      const testContent = `
        ${testCase.imports}
        console.log('Tree-shaking test for: ${testCase.name}');
      `;
      
      fs.writeFileSync(testFile, testContent);
      
      // Bundle with webpack to check final size
      const bundleCommand = `npx webpack --entry ./${testFile} --mode production --output-filename test-bundle-${index}.js`;
      execSync(bundleCommand, { stdio: 'pipe' });
      
      // Check bundle size
      const bundlePath = `dist/test-bundle-${index}.js`;
      const stats = fs.statSync(bundlePath);
      const actualSize = stats.size;
      
      const passed = actualSize <= testCase.expectedSize;
      const status = passed ? '✅' : '❌';
      
      console.log(`${status} ${testCase.name}: ${actualSize} bytes (expected: ≤${testCase.expectedSize})`);
      
      if (!passed) {
        allPassed = false;
      }
      
      // Cleanup
      fs.unlinkSync(testFile);
      fs.unlinkSync(bundlePath);
      
    } catch (error) {
      console.error(`❌ ${testCase.name}: Error - ${error.message}`);
      allPassed = false;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(allPassed ? '✅ All tree-shaking tests passed!' : '❌ Some tree-shaking tests failed!');
  
  return allPassed;
}

// Run validation
if (require.main === module) {
  const success = validateTreeShaking();
  process.exit(success ? 0 : 1);
}

module.exports = { validateTreeShaking };
