import {
  testGeminiConnection,
  callGemini,
  callGeminiJSON,
  countTokens,
} from '../TaskWiseAI/backend/src/config/gemini'

async function test() {
  console.log('🧪 Testing NEW Google GenAI SDK.. .\n');
  console.log('='. repeat(60));

  try {
    // ============================================
    // Test 1: Basic Connection
    // ============================================
    console.log('\n📡 Test 1: Basic Connection');
    console.log('-'.repeat(60));

    const isConnected = await testGeminiConnection();

    if (isConnected) {
      console.log('✅ Gemini API is working with NEW SDK!\n');
    } else {
      console.log('❌ Gemini API connection failed\n');
      return;
    }

    // ============================================
    // Test 2: Simple Text Generation
    // ============================================
    console.log('\n💬 Test 2: Simple Text Generation');
    console.log('-'.repeat(60));

    const textResponse = await callGemini(
      'Say "TaskWise AI is ready!" if you understand.'
    );
    console.log('📝 Response:', textResponse);

    // ============================================
    // Test 3: JSON Response (THE IMPORTANT ONE!)
    // ============================================
    console.log('\n📊 Test 3: JSON Response');
    console.log('-'. repeat(60));

    const jsonPrompt = `
You are a helpful assistant.  Return ONLY valid JSON with no extra text.

Return this exact structure:
{
  "status": "success",
  "message": "Gemini NEW SDK is working! ",
  "features": ["JSON responses", "Streaming", "Token counting"]
}
`;

    const jsonResponse = await callGeminiJSON(jsonPrompt);
    console.log('✅ JSON Response:', JSON.stringify(jsonResponse, null, 2));

    // ============================================
    // Test 4: Structured JSON with Schema
    // ============================================
    console.log('\n🎯 Test 4: Structured JSON with Schema');
    console.log('-'.repeat(60));

    const schema = {
      type: 'object',
      properties: {
        suggestedUser: { type: 'string' },
        confidence: { type: 'number' },
        reasoning: { type: 'string' },
      },
      required:  ['suggestedUser', 'confidence', 'reasoning'],
    };

    const schemaPrompt = `
You are a task assignment expert. 

Task: "Fix authentication bug in backend API"
Team Members: 
1. John (Backend Developer, 15 tasks completed)
2. Jane (Frontend Developer, 8 tasks completed)

Return JSON suggesting who should be assigned. 
`;

    const structuredResponse = await callGeminiJSON(schemaPrompt, schema);
    console.log('✅ Structured Response:', JSON.stringify(structuredResponse, null, 2));

    // ============================================
    // Test 5: Token Counting
    // ============================================
    console.log('\n🔢 Test 5: Token Counting');
    console.log('-'. repeat(60));

    const testPrompt = 'The quick brown fox jumps over the lazy dog.';
    const tokens = await countTokens(testPrompt);
    console.log(`📏 Prompt:  "${testPrompt}"`);
    console.log(`📊 Token count: ${tokens}`);

    // ============================================
    // Summary
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED!   NEW SDK IS READY!');
    console.log('='.repeat(60));
    console.log('\n✅ Capabilities verified:');
    console.log('   • Basic text generation');
    console.log('   • JSON responses');
    console.log('   • Structured JSON with schema');
    console.log('   • Token counting');
    console.log('\n🚀 Ready to build AI features!\n');
  } catch (error:  any) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
  }
}

test();