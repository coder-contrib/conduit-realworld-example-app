// Conduit App Setup Script
// This script creates a test user and sample articles

const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
const TEST_USER = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

const SAMPLE_ARTICLES = [
  {
    title: 'Getting Started with Conduit',
    description: 'A beginner\'s guide to using the Conduit platform',
    body: 'This is a sample article that demonstrates how to get started with the Conduit platform. Follow along to learn the basics!',
    tagList: ['beginners', 'tutorial']
  },
  {
    title: 'Advanced Conduit Features',
    description: 'Exploring the more advanced features of Conduit',
    body: 'Once you\'ve mastered the basics, you can explore these advanced features to get the most out of your Conduit experience.',
    tagList: ['advanced', 'features']
  },
  {
    title: 'Building a Community',
    description: 'Tips for growing your audience on Conduit',
    body: 'Learn how to engage with readers and build a following for your content on the Conduit platform.',
    tagList: ['community', 'growth']
  }
];

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkExistingArticles(authToken) {
  try {
    const response = await axios.get(`${API_URL}/articles`);
    return response.data.articlesCount > 0;
  } catch (error) {
    console.error('❌ Error checking existing articles:', error.message);
    return false;
  }
}

async function setupConduit() {
  console.log('🚀 Starting Conduit app setup...');
  
  try {
    // Wait for backend to be ready
    console.log('⏳ Waiting for backend server to be ready...');
    await wait(5000);
    
    // Create test user
    console.log('👤 Checking for test user...');
    let userResponse;
    
    try {
      userResponse = await axios.post(`${API_URL}/users/login`, {
        user: {
          email: TEST_USER.email,
          password: TEST_USER.password
        }
      });
      console.log('✅ Logged in with existing test user');
    } catch (error) {
      if (error.response && (error.response.status === 404 || error.response.status === 422)) {
        console.log('🆕 Creating new test user...');
        userResponse = await axios.post(`${API_URL}/users`, {
          user: TEST_USER
        });
        console.log('✅ Test user created successfully');
      } else {
        throw error;
      }
    }
    
    const authToken = userResponse.data.user.token;
    
    // Check for existing articles
    const hasArticles = await checkExistingArticles(authToken);
    
    if (hasArticles) {
      console.log('ℹ️ Articles already exist, skipping article creation');
    } else {
      // Create sample articles
      console.log('📝 Creating sample articles...');
      
      for (const article of SAMPLE_ARTICLES) {
        try {
          await axios.post(
            `${API_URL}/articles`, 
            { article },
            { headers: { Authorization: `Token ${authToken}` } }
          );
          console.log(`✅ Created article: ${article.title}`);
        } catch (error) {
          if (error.response && error.response.status === 422) {
            console.log(`ℹ️ Article "${article.title}" may already exist`);
          } else {
            console.error(`❌ Error creating article "${article.title}":`, error.message);
          }
        }
        
        // Small delay between article creation to avoid rate limiting
        await wait(500);
      }
    }
    
    console.log('🎉 Conduit app setup completed successfully!');
    console.log('');
    console.log('You can log in with:');
    console.log(`- Email: ${TEST_USER.email}`);
    console.log(`- Password: ${TEST_USER.password}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the setup
setupConduit();