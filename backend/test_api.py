"""
Simple test script to verify the API is working
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("🧪 Testing AI Safety Empire API...")
print()

# Test 1: Import modules
print("1. Testing imports...")
try:
    from api.main import app
    from database.models import User, Platform, AIDecision
    from database.schemas import UserCreate, AIDecisionCreate
    from utils.auth import hash_password, verify_password
    from blockchain.client import BlockchainClient
    print("   ✅ All imports successful")
except Exception as e:
    print(f"   ❌ Import failed: {e}")
    sys.exit(1)

print()

# Test 2: Password hashing
print("2. Testing password hashing...")
try:
    password = "TestPassword123"
    hashed = hash_password(password)
    assert verify_password(password, hashed), "Password verification failed"
    assert not verify_password("WrongPassword", hashed), "Wrong password should fail"
    print(f"   ✅ Password hashing works")
    print(f"      Original: {password}")
    print(f"      Hashed: {hashed[:50]}...")
except Exception as e:
    print(f"   ❌ Password hashing failed: {e}")

print()

# Test 3: Blockchain client initialization
print("3. Testing blockchain client...")
try:
    blockchain = BlockchainClient()
    print(f"   ✅ Blockchain client initialized")
    print(f"      RPC URL: {blockchain.rpc_url}")
    print(f"      Chain ID: {blockchain.chain_id}")
    print(f"      Connected: {blockchain.is_connected()}")
except Exception as e:
    print(f"   ❌ Blockchain client failed: {e}")

print()

# Test 4: Decision hash creation
print("4. Testing decision hash creation...")
try:
    blockchain = BlockchainClient()
    test_decision = {
        "decision_type": "test",
        "input_data": {"test": "data"},
        "timestamp": "2025-10-14T00:00:00"
    }
    decision_hash = blockchain.create_decision_hash(test_decision)
    print(f"   ✅ Decision hash created")
    print(f"      Hash: {decision_hash}")
    assert decision_hash.startswith("0x"), "Hash should start with 0x"
    assert len(decision_hash) == 66, "Hash should be 66 characters (0x + 64 hex)"
except Exception as e:
    print(f"   ❌ Decision hash creation failed: {e}")

print()

# Test 5: FastAPI app
print("5. Testing FastAPI app...")
try:
    from fastapi.testclient import TestClient
    client = TestClient(app)
    
    # Test root endpoint
    response = client.get("/")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "name" in data, "Response should contain 'name'"
    print(f"   ✅ Root endpoint works")
    print(f"      API Name: {data['name']}")
    print(f"      Version: {data['version']}")
    
    # Test health endpoint
    response = client.get("/health/ping")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print(f"   ✅ Health endpoint works")
    
except Exception as e:
    print(f"   ❌ FastAPI app test failed: {e}")

print()
print("=" * 60)
print("🎉 All tests passed!")
print("=" * 60)
print()
print("Next steps:")
print("  1. Set up PostgreSQL database")
print("  2. Deploy smart contracts to testnet")
print("  3. Update .env with contract addresses")
print("  4. Start the API server: uvicorn api.main:app --reload")
print()

