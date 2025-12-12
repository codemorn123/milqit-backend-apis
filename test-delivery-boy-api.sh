#!/bin/bash

# Delivery Boy API Test Script
# This script tests all delivery boy authentication endpoints

BASE_URL="http://localhost:5001/v1"
PHONE="+919876543210"

echo "🚀 Testing Delivery Boy API Endpoints"
echo "======================================"

# Test 1: Send OTP
echo -e "\n📤 Test 1: Send OTP"
echo "-------------------"
SEND_OTP_RESPONSE=$(curl -s -X POST "$BASE_URL/delivery-boy/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$PHONE\"}")

echo "$SEND_OTP_RESPONSE" | jq '.'

# Extract OTP from response
OTP=$(echo "$SEND_OTP_RESPONSE" | jq -r '.data.otp')
echo "OTP: $OTP"

# Wait for user to see the OTP
sleep 2

# Test 2: Verify OTP and Register
echo -e "\n✅ Test 2: Verify OTP and Register"
echo "-----------------------------------"
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/delivery-boy/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone\": \"$PHONE\",
    \"otp\": \"$OTP\",
    \"name\": \"Test Delivery Boy\",
    \"email\": \"testdelivery@example.com\",
    \"vehicleType\": \"bike\",
    \"vehicleNumber\": \"KA01AB1234\"
  }")

echo "$VERIFY_RESPONSE" | jq '.'

# Extract tokens
ACCESS_TOKEN=$(echo "$VERIFY_RESPONSE" | jq -r '.data.tokens.accessToken')
REFRESH_TOKEN=$(echo "$VERIFY_RESPONSE" | jq -r '.data.tokens.refreshToken')

echo "Access Token: ${ACCESS_TOKEN:0:50}..."
echo "Refresh Token: ${REFRESH_TOKEN:0:50}..."

sleep 2

# Test 3: Get Profile
echo -e "\n👤 Test 3: Get Profile"
echo "----------------------"
curl -s -X GET "$BASE_URL/delivery-boy/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

sleep 2

# Test 4: Update Profile
echo -e "\n📝 Test 4: Update Profile"
echo "-------------------------"
curl -s -X PUT "$BASE_URL/delivery-boy/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Delivery Boy",
    "deliveryZone": ["Bangalore North", "Bangalore East"],
    "emergencyContactName": "Emergency Contact",
    "emergencyContactPhone": "+919999999999"
  }' | jq '.'

sleep 2

# Test 5: Update Location
echo -e "\n📍 Test 5: Update Location"
echo "--------------------------"
curl -s -X PUT "$BASE_URL/delivery-boy/auth/location" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 12.9716,
    "longitude": 77.5946
  }' | jq '.'

sleep 2

# Test 6: Update Availability (Set Available)
echo -e "\n🟢 Test 6: Set Available"
echo "------------------------"
curl -s -X PUT "$BASE_URL/delivery-boy/auth/availability" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isAvailable": true
  }' | jq '.'

sleep 2

# Test 7: Update Availability (Set Unavailable)
echo -e "\n🔴 Test 7: Set Unavailable"
echo "--------------------------"
curl -s -X PUT "$BASE_URL/delivery-boy/auth/availability" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isAvailable": false
  }' | jq '.'

sleep 2

# Test 8: Refresh Token
echo -e "\n🔄 Test 8: Refresh Token"
echo "------------------------"
curl -s -X POST "$BASE_URL/delivery-boy/auth/refresh-token" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }" | jq '.'

sleep 2

# Test 9: Resend OTP
echo -e "\n🔁 Test 9: Resend OTP"
echo "---------------------"
curl -s -X POST "$BASE_URL/delivery-boy/auth/resend-otp" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"$PHONE\"}" | jq '.'

echo -e "\n✅ All tests completed!"
echo "======================="
