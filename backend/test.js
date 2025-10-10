import 'dotenv/config'; // automatically loads .env
import axios from 'axios';

const testJudge0 = async () => {
  try {
    console.log("JUDGE0 URL:", process.env.JUDGE0_API_URL); // check it prints correctly

    const response = await axios.get(`${process.env.JUDGE0_API_URL}/languages`);
    console.log("✅ Connected to Judge0! Languages:", response.data);
  } catch (err) {
    console.error("❌ Cannot connect to Judge0:", err.message);
  }
};

testJudge0();
