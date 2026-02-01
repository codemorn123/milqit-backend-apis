#!/bin/bash

# Cookie Authentication Test Script
# This script tests the cookie-based authentication flow

API_URL="http://localhost:5001/v1/customer/auth"
PHONE="+1234567890"  # Change to a test phone number
COOKIES_FILE="test-cookies.txt"

echo "=========================================="
echo "Cookie Authentication Test"
echo "=========================================="
echo ""

# Step 1: Send OTP
echo "Step 1: Sending OTP to $PHONE"
echo "----------------------------------------"
SEND_OTP_RESPONSE=$(curl -s -X POST "$API_URL/send-otp" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$PHONE\"}")

echo "$SEND_OTP_RESPONSE" | jq '.'
OTP=$(echo "$SEND_OTP_RESPONSE" | jq -r '.data.otp')
echo ""
echo "OTP received: $OTP"
echo ""

# Wait for user to see OTP
echo "Press Enter to continue with OTP verification..."
read

# Step 2: Verify OTP (Web Platform - Sets Cookies)
echo "Step 2: Verifying OTP (Web Platform)"
echo "----------------------------------------"
VERIFY_RESPONSE=$(curl -s -X POST "$API_URL/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$PHONE\", \"otp\":\"$OTP\", \"platform\":\"web\"}" \
  -c "$COOKIES_FILE" \
  -v 2>&1)

echo "$VERIFY_RESPONSE" | grep "Set-Cookie" || echo "No Set-Cookie headers found!"
echo ""
echo "Response Body:"
echo "$VERIFY_RESPONSE" | tail -1 | jq '.'
echo ""

# Check cookies file
if [ -f "$COOKIES_FILE" ]; then
  echo "Cookies saved to $COOKIES_FILE:"
  cat "$COOKIES_FILE"
  echo ""
else
  echo "ERROR: Cookies file not created!"
  exit 1
fi

echo "Press Enter to test refresh token with cookies..."
read

# Step 3: Refresh Token (Using Cookies)
echo "Step 3: Refreshing Token (Using Cookies)"
echo "----------------------------------------"
REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/refresh-token" \
  -H "Content-Type: application/json" \
  -d "{\"platform\":\"web\"}" \
  -b "$COOKIES_FILE" \
  -c "$COOKIES_FILE")

echo "$REFRESH_RESPONSE" | jq '.'
echo ""

echo "Press Enter to test logout..."
read

# Step 4: Logout (Clear Cookies)
echo "Step 4: Logging Out"
echo "----------------------------------------"
LOGOUT_RESPONSE=$(curl -s -X POST "$API_URL/logout" \
  -b "$COOKIES_FILE")

echo "$LOGOUT_RESPONSE" | jq '.'
echo ""

echo "=========================================="
echo "Test Complete!"
echo "=========================================="
echo ""
echo "Cookies file: $COOKIES_FILE"
echo "You can inspect the cookies with: cat $COOKIES_FILE"
echo ""

# Cleanup
echo "Clean up cookies file? (y/n)"
read cleanup
if [ "$cleanup" = "y" ]; then
  rm -f "$COOKIES_FILE"
  echo "Cookies file removed."
fi
