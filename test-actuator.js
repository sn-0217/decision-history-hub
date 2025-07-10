#!/usr/bin/env node

/**
 * Simple test script to verify Spring Boot Actuator endpoints
 * Run with: node test-actuator.js
 */

const endpoints = [
  '/actuator/health',
  '/actuator/metrics/process.uptime',
  '/actuator/metrics/process.start.time',
  '/actuator/metrics/jvm.memory.used',
  '/actuator/metrics/jvm.memory.max',
  '/actuator/metrics/process.cpu.usage',
  '/actuator/metrics/disk.free',
  '/actuator/metrics/disk.total',
  '/actuator/metrics/http.server.requests.active',
  '/actuator/metrics/jvm.threads.live',
  '/actuator/metrics/tomcat.sessions.active.current'
];

const BASE_URL = 'http://localhost:8080';

async function testEndpoint(endpoint) {
  try {
    console.log(`Testing: ${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      console.log(`  ❌ HTTP ${response.status}: ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    
    if (endpoint === '/actuator/health') {
      console.log(`  ✅ Status: ${data.status}`);
    } else {
      // Handle metrics with multiple measurements
      let measurement = data.measurements?.[0];
      
      // For active requests, prefer ACTIVE_TASKS over DURATION
      if (endpoint.includes('http.server.requests.active')) {
        const activeTasksMeasurement = data.measurements?.find(m => m.statistic === 'ACTIVE_TASKS');
        if (activeTasksMeasurement) {
          measurement = activeTasksMeasurement;
        }
      }
      
      const value = measurement?.value;
      const statistic = measurement?.statistic;
      console.log(`  ✅ Value: ${value} ${data.baseUnit || ''} (${statistic || 'VALUE'})`);
    }
    
    return true;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🔍 Testing Spring Boot Actuator Endpoints\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  let passed = 0;
  let total = endpoints.length;
  
  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) passed++;
    console.log(''); // Empty line for readability
  }
  
  console.log(`📊 Results: ${passed}/${total} endpoints working`);
  
  if (passed === 0) {
    console.log('\n❌ No endpoints are working. Possible issues:');
    console.log('  - Spring Boot application is not running');
    console.log('  - Application is not running on localhost:8080');
    console.log('  - Actuator dependency is not added');
    console.log('  - Actuator endpoints are not exposed');
    console.log('\nSee ACTUATOR_SETUP.md for configuration instructions.');
  } else if (passed < total) {
    console.log('\n⚠️  Some endpoints are not working. Check:');
    console.log('  - Spring Boot Actuator configuration');
    console.log('  - Micrometer metrics configuration');
    console.log('  - Application server type (some metrics are server-specific)');
  } else {
    console.log('\n✅ All endpoints are working! The Health Dashboard should display real data.');
  }
}

// Handle Node.js compatibility
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with built-in fetch support.');
  console.log('Alternative: Use curl to test endpoints manually:');
  console.log(`  curl ${BASE_URL}/actuator/health`);
  process.exit(1);
}

runTests().catch(console.error);
