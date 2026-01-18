import { testGeminiConnection, callGemini } from '@/config/gemini';

console.log('🧪 Testing Gemini API Connection...\n');
console.log('='.repeat(60));

const test = async () => {
  try {
    // Test 1: Basic Connection
    console.log('\n📡 Test 1: Basic Connection');
    console.log('-'.repeat(60));
    const isConnected = await testGeminiConnection();
    
    if (isConnected) {
      console.log('✅ Gemini API connection successful!\n');
      
      // Test 2: Simple Query
      console.log('📝 Test 2: Simple Query');
      console.log('-'.repeat(60));
      const response = await callGemini('Say hello in 5 words or less.');
      console.log('Response:', response);
      console.log('\n✅ All tests passed! Gemini is ready to use! 🚀');
    } else {
      console.log('❌ Gemini API connection failed');
    }
  } catch (error: any) {
    console.error('❌ Error during testing:', error.message);
    process.exit(1);
  }
};

test();
